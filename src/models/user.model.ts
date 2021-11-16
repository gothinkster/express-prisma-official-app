import { CommentResponse } from './comment.model';

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  bio: string | null;
  image: any | null;
  articles: any[];
  favorites: any[];
  // eslint-disable-next-line no-use-before-define
  followedBy: ReadonlyArray<FollowersQueryReponse>;
  following: ReadonlyArray<User>;
  comments: ReadonlyArray<CommentResponse>;
}

export type AuthorQueryResponse = Pick<User, 'username' | 'bio' | 'image' | 'followedBy'>;

export type FollowersQueryReponse = Pick<User, 'username'>;

export type Profile = Pick<User, 'username' | 'bio' | 'image'> & { following: boolean };
