import { CommentQueryResponse, CommentResponse } from '../../src/models/comment.model';
import commentMapper from '../../src/mappers/comment.mapper';

describe('CommentMapper', () => {
  test('should return a comment when logged out', () => {
    const commentQueryResponse: CommentQueryResponse = {
      id: 0,
      author: {
        username: '',
        image: '',
        bio: '',
        followedBy: [],
      },
      body: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const commentResponse: CommentResponse = {
      id: 0,
      createdAt: commentQueryResponse.createdAt,
      updatedAt: commentQueryResponse.updatedAt,
      body: '',
      author: {
        username: '',
        image: '',
        bio: '',
        following: false,
      },
    };

    expect(commentMapper(commentQueryResponse)).toEqual(commentResponse);
  });

  test('should return a comment of an user who follow', () => {
    const commentQueryResponse: CommentQueryResponse = {
      id: 0,
      author: {
        username: '',
        image: '',
        bio: '',
        followedBy: [
          {
            username: 'Gerome',
          },
        ],
      },
      body: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const commentResponse: CommentResponse = {
      id: 0,
      createdAt: commentQueryResponse.createdAt,
      updatedAt: commentQueryResponse.updatedAt,
      body: '',
      author: {
        username: '',
        image: '',
        bio: '',
        following: true,
      },
    };

    expect(commentMapper(commentQueryResponse, 'Gerome')).toEqual(commentResponse);
  });
});
