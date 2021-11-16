import prismaMock from '../prisma-mock';
import { deleteComment } from '../../src/services/comment.service';

describe('CommentService', () => {
  describe('deleteComment', () => {
    test('should throw an error ', () => {
      // Given
      const id = 123;

      // When
      prismaMock.comment.findFirst.mockResolvedValue(null);

      // Then
      expect(deleteComment(id)).rejects.toThrowError();
    });
  });
});
