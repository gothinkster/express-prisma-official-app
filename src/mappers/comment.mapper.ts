import authorMapper from './author.mapper';
import { CommentQueryResponse, CommentResponse } from '../models/comment.model';

const commentMapper = (comment: CommentQueryResponse, username?: string): CommentResponse => ({
  id: comment.id,
  createdAt: comment.createdAt,
  updatedAt: comment.updatedAt,
  body: comment.body,
  author: authorMapper(comment.author, username),
});

export default commentMapper;
