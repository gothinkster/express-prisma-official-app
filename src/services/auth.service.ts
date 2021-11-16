import bcrypt from 'bcryptjs';
import prisma from '../../prisma/prisma-client';
import HttpException from '../models/http-exception.model';
import {
  UserCreatePayload,
  UserLoginPayload,
  UserResponse,
  UserUpdatePayload,
} from '../models/user.model';
import userMapper from '../mappers/user.mapper';
import userSelector from '../selectors/user.selector';

const checkUserUniqueness = async (email: string, username: string): Promise<void> => {
  const existingUserByEmail = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  const existingUserByUsername = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });

  if (existingUserByEmail || existingUserByUsername) {
    throw new HttpException(422, {
      errors: {
        ...(existingUserByEmail ? { email: ['has already been taken'] } : {}),
        ...(existingUserByUsername ? { username: ['has already been taken'] } : {}),
      },
    });
  }
};

export const createUser = async (input: UserCreatePayload): Promise<UserResponse> => {
  const email = input.email.trim();
  const username = input.username.trim();
  const password = input.password.trim();

  if (!email) {
    throw new HttpException(422, { errors: { email: ["can't be blank"] } });
  }

  if (!username) {
    throw new HttpException(422, { errors: { username: ["can't be blank"] } });
  }

  if (!password) {
    throw new HttpException(422, { errors: { password: ["can't be blank"] } });
  }

  await checkUserUniqueness(email, username);

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
    select: userSelector,
  });

  return userMapper(user);
};

export const login = async (userPayload: UserLoginPayload): Promise<UserResponse> => {
  const email = userPayload.email.trim();
  const password = userPayload.password.trim();

  if (!email) {
    throw new HttpException(422, { errors: { email: ["can't be blank"] } });
  }

  if (!password) {
    throw new HttpException(422, { errors: { password: ["can't be blank"] } });
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      email: true,
      username: true,
      password: true,
      bio: true,
      image: true,
    },
  });

  if (user) {
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      return userMapper(user);
    }
  }

  throw new HttpException(403, {
    errors: {
      'email or password': ['is invalid'],
    },
  });
};

export const getCurrentUser = async (username: string): Promise<UserResponse> => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    select: userSelector,
  });

  if (!user) {
    throw new HttpException(404, {});
  }

  return userMapper(user);
};

export const updateUser = async (
  userPayload: UserUpdatePayload,
  loggedInUsername: string,
): Promise<UserResponse> => {
  const { email, username, password, image, bio } = userPayload;
  const user = await prisma.user.update({
    where: {
      username: loggedInUsername,
    },
    data: {
      ...(email ? { email } : {}),
      ...(username ? { username } : {}),
      ...(password ? { password } : {}),
      ...(image ? { image } : {}),
      ...(bio ? { bio } : {}),
    },
    select: userSelector,
  });

  return userMapper(user);
};

export const findUserIdByUsername = async (username: string): Promise<number> => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new HttpException(404, {});
  }

  return user.id;
};
