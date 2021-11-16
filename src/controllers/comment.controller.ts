import { NextFunction, Request, Response, Router } from 'express';
import auth from '../utils/auth';
import { addComment, deleteComment, getCommentsByArticle } from '../services/comment.service';

const router = Router();

/**
 * Get comments from an article
 * @auth optional
 * @route {GET} /articles/:slug/comments
 * @param slug slug of the article (based on the title)
 * @returns comments list of comments
 */
router.get(
  '/articles/:slug/comments',
  auth.optional,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const comments = await getCommentsByArticle(req.params.slug, req.user?.username);
      res.json({ comments });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Add comment to article
 * @auth required
 * @route {POST} /articles/:slug/comments
 * @param slug slug of the article (based on the title)
 * @bodyparam body content of the comment
 * @returns comment created comment
 */
router.post(
  '/articles/:slug/comments',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const comment = await addComment(req.body.comment.body, req.params.slug, req.user!.username);
      res.json({ comment });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Delete comment
 * @auth required
 * @route {DELETE} /articles/:slug/comments/:id
 * @param slug slug of the article (based on the title)
 * @param id id of the comment
 */
router.delete(
  '/articles/:slug/comments/:id',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteComment(Number(req.params.id));
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  },
);

export default router;
