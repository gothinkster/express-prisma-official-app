import generateToken from '../utils/token.utils';
import { UserQueryResponse, UserResponse } from '../models/user.model';

export const userMapper = (user: UserQueryResponse): UserResponse => ({
  email: user.email,
  username: user.username,
  bio: user.bio,
  image: user.bio,
  token: generateToken(user),
});

export default userMapper;
