export interface User {
  username: string;
  email: string;
  password: string;
  bio: string | null;
  image: string | null;
  // eslint-disable-next-line no-use-before-define
  followedBy: ReadonlyArray<FollowersQueryReponse>;
  token: string;
  following: boolean;
}

export type UserCreatePayload = Pick<User, 'username' | 'email' | 'password'>;

export type UserUpdatePayload = Pick<User, 'username' | 'image' | 'bio' | 'email' | 'password'>;

export type UserLoginPayload = Pick<User, 'email' | 'password'>;

export type UserQueryResponse = Pick<User, 'username' | 'image' | 'bio' | 'email'>;

export type UserResponse = Pick<User, 'username' | 'image' | 'bio' | 'email' | 'token'>;

export type AuthorQueryResponse = Pick<User, 'username' | 'bio' | 'image' | 'followedBy'>;

export type FollowersQueryReponse = Pick<User, 'username'>;

export type Profile = Pick<User, 'username' | 'bio' | 'image' | 'following'>;
