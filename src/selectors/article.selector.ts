import { Prisma } from '@prisma/client';

const articleSelector = Prisma.validator<Prisma.ArticleSelect>()({
  slug: true,
  title: true,
  description: true,
  body: true,
  createdAt: true,
  updatedAt: true,
  tagList: {
    select: {
      name: true,
    },
  },
  author: {
    select: {
      username: true,
      bio: true,
      image: true,
      followedBy: true,
    },
  },
  favoritedBy: {
    select: {
      username: true,
    },
  },
  _count: {
    select: {
      favoritedBy: true,
    },
  },
});

export default articleSelector;
