import prismaMock from '../prisma-mock';
import { followUser, getProfile, unfollowUser } from '../../src/services/profile.service';

describe('ProfileService', () => {
  describe('getProfile', () => {
    test('should return a following property', async () => {
      // Given
      const profileUsername = 'RealWorld';
      const username = 'Gerome';

      const mockedResponse = {
        id: 123,
        username: 'RealWorld',
        email: 'realworld@me',
        password: '1234',
        bio: null,
        image: null,
        token: '',
        followedBy: [],
      };

      // When
      prismaMock.user.findUnique.mockResolvedValue(mockedResponse);

      // Then
      await expect(getProfile(profileUsername, username)).resolves.toHaveProperty('following');
    });

    test('should throw an error if no user is found', async () => {
      // Given
      const profileUsername = 'RealWorld';
      const username = 'Gerome';

      // When
      prismaMock.user.findUnique.mockResolvedValue(null);

      // Then
      await expect(getProfile(profileUsername, username)).rejects.toThrowError();
    });
  });

  describe('followUser', () => {
    test('shoud return a following property', async () => {
      // Given
      const usernamePayload = 'AnotherUser';
      const usernameAuth = 'RealWorld';

      const mockedAuthUser = {
        id: 123,
        username: 'RealWorld',
        email: 'realworld@me',
        password: '1234',
        bio: null,
        image: null,
        token: '',
        followedBy: [],
      };

      const mockedResponse = {
        id: 123,
        username: 'AnotherUser',
        email: 'another@me',
        password: '1234',
        bio: null,
        image: null,
        token: '',
        followedBy: [],
      };

      // When
      prismaMock.user.findUnique.mockResolvedValue(mockedAuthUser);
      prismaMock.user.update.mockResolvedValue(mockedResponse);

      // Then
      await expect(followUser(usernamePayload, usernameAuth)).resolves.toHaveProperty('following');
    });

    test('shoud throw an error if no user is found', async () => {
      // Given
      const usernamePayload = 'AnotherUser';
      const usernameAuth = 'RealWorld';

      // When
      prismaMock.user.findUnique.mockResolvedValue(null);

      // Then
      await expect(followUser(usernamePayload, usernameAuth)).rejects.toThrowError();
    });
  });

  describe('unfollowUser', () => {
    test('shoud return a following property', async () => {
      // Given
      const usernamePayload = 'AnotherUser';
      const usernameAuth = 'RealWorld';

      const mockedAuthUser = {
        id: 123,
        username: 'RealWorld',
        email: 'realworld@me',
        password: '1234',
        bio: null,
        image: null,
        token: '',
        followedBy: [],
      };

      const mockedResponse = {
        id: 123,
        username: 'AnotherUser',
        email: 'another@me',
        password: '1234',
        bio: null,
        image: null,
        token: '',
        followedBy: [],
      };

      // When
      prismaMock.user.findUnique.mockResolvedValue(mockedAuthUser);
      prismaMock.user.update.mockResolvedValue(mockedResponse);

      // Then
      await expect(unfollowUser(usernamePayload, usernameAuth)).resolves.toHaveProperty(
        'following',
      );
    });

    test('shoud throw an error if no user is found', async () => {
      // Given
      const usernamePayload = 'AnotherUser';
      const usernameAuth = 'RealWorld';

      // When
      prismaMock.user.findUnique.mockResolvedValue(null);

      // Then
      await expect(unfollowUser(usernamePayload, usernameAuth)).rejects.toThrowError();
    });
  });
});
