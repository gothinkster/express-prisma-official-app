import { AuthorQueryResponse, Profile } from '../../src/models/user.model';
import authorMapper from '../../src/mappers/author.mapper';

describe('AuthorMapper', () => {
  test('should return an author when logged out', () => {
    const authorQueryResponse: AuthorQueryResponse = {
      username: '',
      image: '',
      bio: '',
      followedBy: [],
    };

    const authorResponse: Profile = {
      username: '',
      image: '',
      bio: '',
      following: false,
    };

    expect(authorMapper(authorQueryResponse)).toEqual(authorResponse);
  });

  test('should return an author when logged out', () => {
    const authorQueryResponse: AuthorQueryResponse = {
      username: '',
      image: '',
      bio: '',
      followedBy: [
        {
          username: 'Gerome',
        },
      ],
    };

    const authorResponse: Profile = {
      username: '',
      image: '',
      bio: '',
      following: true,
    };

    expect(authorMapper(authorQueryResponse, 'Gerome')).toEqual(authorResponse);
  });
});
