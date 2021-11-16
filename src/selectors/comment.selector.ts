import { Prisma } from '@prisma/client';

const commentSelector = Prisma.validator<Prisma.CommentSelect>()({
  id: true,
  createdAt: true,
  updatedAt: true,
  body: true,
  author: {
    select: {
      username: true,
      bio: true,
      image: true,
      followedBy: true,
    },
  },
});

export default commentSelector;
