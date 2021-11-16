import { Tag } from './tag.model';
import { AuthorQueryResponse, Profile, FollowersQueryReponse } from './user.model';

export interface ArticleCreatePayload {
  title: string;
  description: string;
  body: string;
  tagList: ReadonlyArray<string>;
}

export interface ArticleFindQuery {
  author?: string;
  tag?: string;
  favorited?: string;
  offset?: string;
  limit?: string;
}

export interface ArticleQueryResponse {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: ReadonlyArray<Tag>;
  createdAt: Date;
  updatedAt: Date;
  favoritedBy: ReadonlyArray<FollowersQueryReponse>;
  author: AuthorQueryResponse;
}

export interface ArticleResponse {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: ReadonlyArray<string>;
  createdAt: Date;
  updatedAt: Date;
  favorited: boolean;
  favoritesCount: number;
  author: Profile;
}

export interface ArticleListResponse {
  articles: ReadonlyArray<ArticleResponse>;
  articlesCount: number;
}
