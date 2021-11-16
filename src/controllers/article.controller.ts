import { NextFunction, Request, Response, Router } from 'express';
import auth from '../utils/auth';
import {
  createArticle,
  deleteArticle,
  favoriteArticle,
  getArticle,
  getArticles,
  getFeed,
  unfavoriteArticle,
  updateArticle,
} from '../services/article.service';

const router = Router();

/**
 * Get paginated articles
 * @auth optional
 * @route {GET} /articles
 * @queryparam offset number of articles dismissed from the first one
 * @queryparam limit number of articles returned
 * @queryparam tag
 * @queryparam author
 * @queryparam favorited
 * @returns articles: list of articles
 */
router.get('/articles', auth.optional, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const articles = await getArticles(req.query, req.user?.username);
    res.json(articles);
  } catch (error) {
    next(error);
  }
});

/**
 * Get paginated feed articles
 * @auth required
 * @route {GET} /articles/feed
 * @returns articles list of articles
 */
router.get(
  '/articles/feed',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const articles = await getFeed(
        Number(req.query.offset),
        Number(req.query.limit),
        req.user!.username,
      );
      res.json(articles);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Create article
 * @route {POST} /articles
 * @bodyparam  title
 * @bodyparam  description
 * @bodyparam  body
 * @bodyparam  tagList list of tags
 * @returns article created article
 */
router.post('/articles', auth.required, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const article = await createArticle(req.body.article, req.user!.username);
    res.json({ article });
  } catch (error) {
    next(error);
  }
});

/**
 * Get unique article
 * @auth optional
 * @route {GET} /article/:slug
 * @param slug slug of the article (based on the title)
 * @returns article
 */
router.get(
  '/articles/:slug',
  auth.optional,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const article = await getArticle(req.params.slug, req.user?.username as string | undefined);
      res.json({ article });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Update article
 * @auth required
 * @route {PUT} /articles/:slug
 * @param slug slug of the article (based on the title)
 * @bodyparam title new title
 * @bodyparam description new description
 * @bodyparam body new content
 * @returns article updated article
 */
router.put(
  '/articles/:slug',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const article = await updateArticle(req.body.article, req.params.slug, req.user!.username);
      res.json({ article });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Delete article
 * @auth required
 * @route {DELETE} /article/:id
 * @param slug slug of the article
 */
router.delete(
  '/articles/:slug',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteArticle(req.params.slug);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Favorite article
 * @auth required
 * @route {POST} /articles/:slug/favorite
 * @param slug slug of the article (based on the title)
 * @returns article favorited article
 */
router.post(
  '/articles/:slug/favorite',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const article = await favoriteArticle(req.params.slug, req.user!.username);
      res.json({ article });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Unfavorite article
 * @auth required
 * @route {DELETE} /articles/:slug/favorite
 * @param slug slug of the article (based on the title)
 * @returns article unfavorited article
 */
router.delete(
  '/articles/:slug/favorite',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const article = await unfavoriteArticle(req.params.slug, req.user!.username);
      res.json({ article });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
