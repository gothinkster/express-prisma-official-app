import slugify from 'slugify';
import { Prisma } from '@prisma/client';
import prisma from '../../prisma/prisma-client';
import HttpException from '../models/http-exception.model';
import {
  ArticleCreatePayload,
  ArticleFindQuery,
  ArticleListResponse,
  ArticleQueryResponse,
  ArticleResponse,
} from '../models/article.model';
import { findUserIdByUsername } from './auth.service';
import articleMapper from '../mappers/article.mapper';
import articleSelector from '../selectors/article.selector';

const buildFindAllQuery = (query: ArticleFindQuery): Prisma.ArticleWhereInput => {
  const queries = [];

  if (query.author) {
    queries.push({
      author: {
        username: {
          equals: query.author,
        },
      },
    });
  }

  if (query.tag) {
    queries.push({
      tagList: {
        some: {
          name: query.tag,
        },
      },
    });
  }

  if (query.favorited) {
    queries.push({
      favoritedBy: {
        some: {
          username: {
            equals: query.favorited,
          },
        },
      },
    });
  }

  return {
    AND: queries,
  };
};

export const findManyArticles = async (
  query: Prisma.ArticleWhereInput,
  offset: number,
  limit: number,
): Promise<ArticleQueryResponse[]> =>
  prisma.article.findMany({
    where: query,
    orderBy: {
      createdAt: 'desc',
    },
    skip: offset || 0,
    take: limit || 10,
    select: articleSelector,
  });

export const getArticles = async (
  query: ArticleFindQuery,
  username?: string,
): Promise<ArticleListResponse> => {
  const queries = buildFindAllQuery(query);

  const articles = await findManyArticles(queries, Number(query.offset), Number(query.limit));

  return {
    articles: articles.map(article => articleMapper(article, username)),
    articlesCount: articles.length,
  };
};

export const getFeed = async (
  offset: number,
  limit: number,
  username: string,
): Promise<ArticleListResponse> => {
  const id = await findUserIdByUsername(username);

  const authorQuery = Prisma.validator<Prisma.ArticleWhereInput>()({
    author: {
      followedBy: { some: { id } },
    },
  });

  const articles = await findManyArticles(authorQuery, offset, limit);

  return {
    articles: articles.map(article => articleMapper(article, username)),
    articlesCount: articles.length,
  };
};

export const createArticle = async (
  articlePayload: ArticleCreatePayload,
  username: string,
): Promise<ArticleResponse> => {
  const { title, description, body, tagList } = articlePayload;

  if (!title) {
    throw new HttpException(422, { errors: { title: ["can't be blank"] } });
  }

  if (!description) {
    throw new HttpException(422, { errors: { description: ["can't be blank"] } });
  }

  if (!body) {
    throw new HttpException(422, { errors: { body: ["can't be blank"] } });
  }

  const id = await findUserIdByUsername(username);

  const slug = `${slugify(title)}-${id}`;

  const existingTitle = await prisma.article.findUnique({
    where: {
      slug,
    },
    select: {
      slug: true,
    },
  });

  if (existingTitle) {
    throw new HttpException(422, { errors: { title: ['must be unique'] } });
  }

  const article = await prisma.article.create({
    data: {
      title,
      description,
      body,
      slug,
      tagList: {
        connectOrCreate: tagList.map((tag: string) => ({
          create: { name: tag },
          where: { name: tag },
        })),
      },
      author: {
        connect: {
          id,
        },
      },
    },
    select: articleSelector,
  });

  return articleMapper(article, username);
};

export const getArticle = async (slug: string, username?: string): Promise<ArticleResponse> => {
  const article = await prisma.article.findUnique({
    where: {
      slug,
    },
    select: articleSelector,
  });

  if (!article) {
    throw new HttpException(404, {});
  }

  return articleMapper(article, username);
};

const disconnectArticlesTags = async (slug: string): Promise<void> => {
  await prisma.article.update({
    where: {
      slug,
    },
    data: {
      tagList: {
        set: [],
      },
    },
  });
};

export const updateArticle = async (
  article: ArticleCreatePayload,
  slug: string,
  username: string,
): Promise<ArticleResponse> => {
  let newSlug = null;
  const id = await findUserIdByUsername(username);

  if (article.title) {
    newSlug = `${slugify(article.title)}-${id}`;

    if (newSlug !== slug) {
      const existingTitle = await prisma.article.findFirst({
        where: {
          slug: newSlug,
        },
        select: {
          slug: true,
        },
      });

      if (existingTitle) {
        throw new HttpException(422, { errors: { title: ['must be unique'] } });
      }
    }
  }

  const tagList = article.tagList?.length
    ? article.tagList.map((tag: string) => ({
        create: { name: tag },
        where: { name: tag },
      }))
    : [];

  await disconnectArticlesTags(slug);

  const updatedArticle = await prisma.article.update({
    where: {
      slug,
    },
    data: {
      ...(article.title ? { title: article.title } : {}),
      ...(article.body ? { body: article.body } : {}),
      ...(article.description ? { description: article.description } : {}),
      ...(newSlug ? { slug: newSlug } : {}),
      tagList: {
        connectOrCreate: tagList,
      },
    },
    select: articleSelector,
  });

  return articleMapper(updatedArticle, username);
};

export const deleteArticle = async (slug: string, username: string): Promise<void> => {
  const article = await prisma.article.findUnique({
    where: {
      slug,
    },
    select: {
      author: {
        select: {
          username: true,
        },
      },
    },
  });

  if (!article) {
    throw new HttpException(404, {});
  } else if (article.author.username !== username) {
    throw new HttpException(403, {});
  }

  await prisma.article.delete({
    where: {
      slug,
    },
  });
};

export const favoriteArticle = async (slug: string, username: string): Promise<ArticleResponse> => {
  const id = await findUserIdByUsername(username);

  const article = await prisma.article.update({
    where: {
      slug,
    },
    data: {
      favoritedBy: {
        connect: {
          id,
        },
      },
    },
    select: articleSelector,
  });

  return articleMapper(article, username);
};

export const unfavoriteArticle = async (
  slug: string,
  username: string,
): Promise<ArticleResponse> => {
  const id = await findUserIdByUsername(username);

  const article = await prisma.article.update({
    where: {
      slug,
    },
    data: {
      favoritedBy: {
        disconnect: {
          id,
        },
      },
    },
    select: articleSelector,
  });

  return articleMapper(article, username);
};
