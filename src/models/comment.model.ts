import { AuthorQueryResponse, Profile } from './user.model';

export interface CommentResponse {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  body: string;
  author: Profile;
}

export interface CommentQueryResponse {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  body: string;
  author: AuthorQueryResponse;
}

export type CommentListResponse = ReadonlyArray<CommentResponse>;
