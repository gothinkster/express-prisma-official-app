import prisma from '../../prisma/prisma-client';
import profileMapper from '../utils/profile.utils';
import HttpException from '../models/http-exception.model';
import { findUserIdByUsername } from './auth.service';
import { Profile } from '../models/user.model';
import profileSelector from '../selectors/profile.selector';

export const getProfile = async (
  profileUsername: string | undefined,
  username: string | undefined,
): Promise<Profile> => {
  const profile = await prisma.user.findUnique({
    where: {
      username: profileUsername,
    },
    select: profileSelector,
  });

  if (!profile) {
    throw new HttpException(404, {});
  }

  return profileMapper(profile, username);
};

export const followUser = async (profileUsername: string, username: string): Promise<Profile> => {
  const id = await findUserIdByUsername(username);

  const profile = await prisma.user.update({
    where: {
      username: profileUsername,
    },
    data: {
      followedBy: {
        connect: {
          id,
        },
      },
    },
    select: profileSelector,
  });

  return profileMapper(profile, username);
};

export const unfollowUser = async (profileUsername: string, username: string): Promise<Profile> => {
  const id = await findUserIdByUsername(username);

  const profile = await prisma.user.update({
    where: {
      username: profileUsername,
    },
    data: {
      followedBy: {
        disconnect: {
          id,
        },
      },
    },
    select: profileSelector,
  });

  return profileMapper(profile, username);
};
