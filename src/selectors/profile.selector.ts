import { Prisma } from '@prisma/client';

const profileSelector = Prisma.validator<Prisma.UserSelect>()({
  username: true,
  bio: true,
  image: true,
  followedBy: {
    select: {
      username: true,
    },
  },
});

export default profileSelector;
