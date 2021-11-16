import prisma from '../../prisma/prisma-client';

const getTags = async (): Promise<string[]> => {
  const tags = await prisma.tag.findMany({
    where: {
      articles: {
        some: {},
      },
    },
    select: {
      name: true,
    },
    orderBy: {
      articles: {
        _count: 'desc',
      },
    },
    take: 10,
  });

  return tags.map(tag => tag.name);
};

export default getTags;
