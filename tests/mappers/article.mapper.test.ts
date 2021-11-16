import { ArticleQueryResponse, ArticleResponse } from '../../src/models/article.model';
import articleMapper from '../../src/mappers/article.mapper';

describe('ArticleMapper', () => {
  test('should return a formatted article', () => {
    const articleQueryResponse: ArticleQueryResponse = {
      author: {
        username: 'Gerome',
        image: '',
        bio: '',
        followedBy: [],
      },
      body: '',
      createdAt: new Date(),
      description: '',
      favoritedBy: [],
      slug: '',
      tagList: [],
      title: '',
      updatedAt: new Date(),
    };

    const articleResponse: ArticleResponse = {
      author: {
        username: 'Gerome',
        image: '',
        bio: '',
        following: false,
      },
      body: '',
      createdAt: articleQueryResponse.createdAt,
      description: '',
      favorited: false,
      favoritesCount: 0,
      slug: '',
      tagList: [],
      title: '',
      updatedAt: articleQueryResponse.updatedAt,
    };

    expect(articleMapper(articleQueryResponse)).toEqual(articleResponse);
  });
});
