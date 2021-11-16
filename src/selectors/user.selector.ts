import { Prisma } from '@prisma/client';

export const userSelector = Prisma.validator<Prisma.UserSelect>()({
  email: true,
  username: true,
  bio: true,
  image: true,
});

export default userSelector;
