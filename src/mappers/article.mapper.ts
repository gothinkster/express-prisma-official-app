import { ArticleQueryResponse, ArticleResponse } from '../models/article.model';
import authorMapper from './author.mapper';

const articleMapper = (article: ArticleQueryResponse, username?: string): ArticleResponse => ({
  slug: article.slug,
  title: article.title,
  description: article.description,
  body: article.body,
  tagList: article.tagList.map(tag => tag.name),
  createdAt: article.createdAt,
  updatedAt: article.updatedAt,
  favorited: article.favoritedBy.some(item => item.username === username),
  favoritesCount: article.favoritedBy.length,
  author: authorMapper(article.author, username),
});

export default articleMapper;
