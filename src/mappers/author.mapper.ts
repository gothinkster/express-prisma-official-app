import { AuthorQueryResponse, Profile } from '../models/user.model';

const authorMapper = (author: AuthorQueryResponse, username?: string): Profile => ({
  username: author.username,
  bio: author.bio,
  image: author.image,
  following: author.followedBy.some(follow => follow.username === username),
});

export default authorMapper;
