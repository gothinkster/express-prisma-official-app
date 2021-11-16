import { Profile, User } from '../models/user.model';
import { ProfileResponse } from '../models/profile-response.model';

const profileMapper = (profile: ProfileResponse, username: string | undefined): Profile => ({
  username: profile.username,
  bio: profile.bio,
  image: profile.image,
  following: username
    ? profile?.followedBy.some(
        (followingUser: Pick<User, 'username'>) => followingUser.username === username,
      )
    : false,
});

export default profileMapper;
