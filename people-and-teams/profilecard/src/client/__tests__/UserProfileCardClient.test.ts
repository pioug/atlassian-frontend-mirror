import { DirectoryGraphQLErrors } from '../../util/errors';
import { directoryGraphqlQuery } from '../graphqlUtils';
import UserProfileCardClient from '../UserProfileCardClient';

jest.mock('../../util/performance', () => ({
  getPageTime: jest.fn(() => 1000),
}));

jest.mock('../../util/analytics', () => ({
  userRequestAnalytics: jest.fn((status, attrs) => ({
    status,
    attrs,
  })),
}));

jest.mock('../graphqlUtils');
(directoryGraphqlQuery as jest.Mock).mockImplementation(() =>
  Promise.resolve({ User: {} }),
);

const mockAnalytics = jest.fn();

const mockDirectoryError = new DirectoryGraphQLErrors(
  [{ message: 'Test error', category: 'Internal', type: 'type' }],
  'test-id',
);

describe('UserProfileCardClient', () => {
  const options = {
    url: 'https://test.com',
    cacheMaxAge: 1000,
  };

  const userId = 'test-user';
  const cloudId = 'test-cloud';

  let client: UserProfileCardClient;

  beforeEach(() => {
    client = new UserProfileCardClient(options);
    jest.clearAllMocks();
  });

  it('should throw an error if options.url is not provided', async () => {
    // @ts-ignore
    client = new UserProfileCardClient({});
    await expect(client.makeRequest(cloudId, userId)).rejects.toThrow(
      'options.url is a required parameter',
    );
  });

  it('should return a cached profile if it exists', async () => {
    const spy = jest.spyOn(client, 'makeRequest');
    client.setCachedProfile(`${cloudId}/${userId}`, { id: userId });
    const result = await client.getProfile(cloudId, userId, mockAnalytics);
    expect(spy).not.toHaveBeenCalled();
    expect(result).toEqual(expect.objectContaining({ id: userId }));
  });

  it('should make a request if profile is not cached', async () => {
    const spy = jest.spyOn(client, 'makeRequest');
    await client.getProfile(cloudId, userId, mockAnalytics);
    expect(spy).toHaveBeenCalledWith(cloudId, userId);
  });

  it('should handle request errors', async () => {
    (directoryGraphqlQuery as jest.Mock).mockRejectedValue(mockDirectoryError);

    await expect(
      client.getProfile(cloudId, userId, mockAnalytics),
    ).rejects.toThrow('DirectoryGraphQLErrors');
  });

  it('should call analytics when makeRequest throws an error', async () => {
    (directoryGraphqlQuery as jest.Mock).mockRejectedValue(mockDirectoryError);

    await expect(
      client.getProfile(cloudId, userId, mockAnalytics),
    ).rejects.toThrow('DirectoryGraphQLErrors');

    expect(mockAnalytics).toHaveBeenLastCalledWith({
      attrs: {
        duration: 0,
        errorCount: 1,
        errorDetails: [
          {
            errorCategory: 'Internal',
            errorNumber: undefined,
            errorPath: '',
            errorType: 'type',
            errorMessage: 'Test error',
            isSLOFailure: true,
          },
        ],
        errorMessage: 'DirectoryGraphQLErrors',
        isSLOFailure: true,
        traceId: 'test-id',
      },
      status: 'failed',
    });
  });
});
