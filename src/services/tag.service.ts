import prisma from '../../prisma/prisma-client';

const getTags = async (username: string | undefined): Promise<string[]> => {
  const query = {
    every: {
      author: {
        username: {
          equals: username,
        },
      },
    },
  };

  const tags = await prisma.tag.groupBy({
    where: {
      articles: {
        some: {},
        ...(username ? query : {}),
      },
    },
    by: ['name'],
    orderBy: {
      _count: {
        name: 'desc',
      },
    },
    take: 10,
  });

  return tags.map(tag => tag.name);
};

export default getTags;
