import RecommendationsClient from '../../../api/recommendationClient';
import SmartMentionResource, {
  SmartMentionConfig,
} from '../../../api/SmartMentionResource';
import { MentionContextIdentifier, MentionNameStatus } from '../../../resource';
import expectedMentionsResponse from './mentions-response.json';
import recommendationsResponse from './recommendations-response.json';

jest.mock('../../../api/recommendationClient', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const smartConfig: SmartMentionConfig = {
  productKey: 'jira',
  siteId: 'site1',
};

describe('SmartMentionResource', () => {
  let getUserRecommendationsMock = RecommendationsClient as jest.Mock;

  beforeEach(() => {
    getUserRecommendationsMock.mockReturnValue(Promise.resolve([]));
  });

  it('should return mention results', async () => {
    getUserRecommendationsMock.mockReturnValue(
      Promise.resolve(recommendationsResponse),
    );

    let provider = new SmartMentionResource(smartConfig);
    let mentionsResult = await provider.getRecommendedMentions(
      '',
      defaultContextIdentifier(),
    );
    expect(mentionsResult.mentions).toEqual(expectedMentionsResponse);
  });

  it('should debounce calls to receive mention results', async () => {
    getUserRecommendationsMock.mockReturnValue(
      Promise.resolve(recommendationsResponse),
    );

    let provider = new SmartMentionResource(smartConfig);
    let mentionsResult = await provider.getRecommendedMentions(
      '',
      defaultContextIdentifier(),
    );
    expect(mentionsResult.mentions).toEqual(expectedMentionsResponse);
  });

  it('should return a users requested event to the analyticsListeners', async () => {
    getUserRecommendationsMock.mockReturnValue(
      Promise.resolve(recommendationsResponse),
    );
    let provider = new SmartMentionResource(smartConfig);
    const analyticsListener = jest.fn();

    provider.subscribe(
      'test',
      undefined,
      undefined,
      undefined,
      undefined,
      analyticsListener,
    );
    let mentionsResult = await provider.getRecommendedMentions(
      '',
      defaultContextIdentifier(),
    );
    const requestAttributes = {
      context: 'objectId',
      pickerType: 'mentions',
      sessionId: 'sessionId',
      source: 'smarts',
    };

    const requestSuccessfulAttributes = {
      context: 'objectId',
      displayedUsers: [
        { id: '1234567890987654345678', type: 'user' },
        { id: '98765434567845678', type: 'user' },
        { id: '987654456789088888', type: 'user' },
        { id: '2878', type: 'team' },
      ],
      elapsedTimeMilli: expect.any(Number),
      pickerType: 'mentions',
      sessionId: 'sessionId',
      users: [
        { id: '1234567890987654345678', type: 'user' },
        { id: '98765434567845678', type: 'user' },
        { id: '987654456789088888', type: 'user' },
        { id: '2878', type: 'team' },
      ],
      source: 'smarts',
    };

    expect(mentionsResult.mentions).toEqual(expectedMentionsResponse);
    expect(analyticsListener).toHaveBeenCalledTimes(2);
    expect(analyticsListener).toHaveBeenCalledWith(
      'smart',
      'users',
      'requested',
      requestAttributes,
    );
    expect(analyticsListener).toHaveBeenCalledWith(
      'smart',
      'usersRequest',
      'successful',
      requestSuccessfulAttributes,
    );
  });

  it('should trigger user request failed event', async () => {
    getUserRecommendationsMock.mockReturnValue(
      Promise.reject({
        message: `error calling smart service, statusCode=500, statusText=BANG`,
      }),
    );
    let provider = new SmartMentionResource(smartConfig);
    const analyticsListener = jest.fn();

    provider.subscribe(
      'test',
      undefined,
      undefined,
      undefined,
      undefined,
      analyticsListener,
    );

    try {
      await provider.getRecommendedMentions('', defaultContextIdentifier());
    } catch (e) {}

    const requestFailureAttributes = expect.objectContaining({
      context: 'objectId',
      pickerType: 'mentions',
      sessionId: 'sessionId',
    });

    expect(analyticsListener).toHaveBeenCalledTimes(2);
    expect(analyticsListener).toHaveBeenCalledWith(
      'smart',
      'usersRequest',
      'failed',
      requestFailureAttributes,
    );
  });

  it('should support mention name resolving without supplying MentionNameResolver', () => {
    const resource = new SmartMentionResource(smartConfig);
    expect(resource.supportsMentionNameResolving()).toEqual(true);
  });

  it('should support mention name resolving when supplying a custom MentionNameResolver', () => {
    const mockUser = { id: 'aaid-1234', name: 'User name' };
    const expectedResult = {
      id: mockUser.id,
      name: mockUser.name,
      status: MentionNameStatus.OK,
    };
    const lookupNameSpy = jest.fn().mockReturnValue(expectedResult);
    const resource = new SmartMentionResource({
      ...smartConfig,
      mentionNameResolver: {
        cacheName: jest.fn(),
        lookupName: lookupNameSpy,
      },
    });

    // Custom mention name resolver supported
    expect(resource.supportsMentionNameResolving()).toEqual(true);

    // Verify that customer mention name resolver is called and data is handled correctly
    const result = resource.resolveMentionName(mockUser.id);
    expect(lookupNameSpy).toHaveBeenCalledWith(mockUser.id);
    expect(result).toEqual(expectedResult);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

function defaultContextIdentifier(): MentionContextIdentifier {
  return {
    containerId: 'containerId',
    objectId: 'objectId',
    childObjectId: 'childObjectId',
    sessionId: 'sessionId',
  };
}
