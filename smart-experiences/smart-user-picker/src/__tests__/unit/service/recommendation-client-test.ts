import fetchMock from 'fetch-mock/cjs/client';

import getUserRecommendations from '../../../service/recommendation-client';
import { type RecommendationRequest } from '../../../types';
import { type IntlShape } from 'react-intl-next';

const URS_URL = '/gateway/api/v1/recommendations';

const intl = {} as IntlShape;

const exampleContext = {
  childObjectId: 'childObjectId',
  containerId: 'containerId',
  contextType: 'fieldId',
  objectId: 'objectId',
  principalId: 'principalId',
  productAttributes: {
    emailDomain: 'Context',
    isPublicRepo: false,
    workspaceIds: ['02b941e3-cfaa-40f9-9a58-cec53e20bdc3'],
    pullRequestId: 18056,
  },
  productKey: 'bitbucket',
  sessionId: 'session-id',
  siteId: 'site-id',
};

const exampleRequest: RecommendationRequest = {
  context: exampleContext,
  maxNumberOfResults: 50,
  query: 'query',
  includeUsers: true,
  includeGroups: true,
  includeTeams: true,
  includeNonLicensedUsers: false,
};

const exampleResponse = {
  status: 200,
  body: JSON.stringify({
    recommendedUsers: [
      {
        entityType: 'USER',
        id: '5ee0adc79583380ab0afec31',
        name: 'John Smith',
        email: 'jsmith@atlassian.com',
        avatarUrl:
          'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net',
        nickname: 'John Smith',
        matchPositions: {},
        accessLevel: 'CONTAINER',
        accountStatus: 'ACTIVE',
        notMentionable: false,
        locale: 'en-GB',
        title: 'Development Manager',
        userType: 'DEFAULT',
      },
      {
        entityType: 'USER',
        id: '5ee0adc79583380ab0afec32',
        name: 'John Doe',
        email: 'jsmith@atlassian.com',
        avatarUrl:
          'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net',
        nickname: 'John Doe',
        matchPositions: {},
        accessLevel: 'CONTAINER',
        accountStatus: 'ACTIVE',
        notMentionable: false,
        locale: 'en-GB',
        title: 'Development Manager',
        userType: 'DEFAULT',
      },
    ],
  }),
};

describe('default-value-hydration-client', () => {
  afterEach(() => {
    jest.clearAllMocks();
    fetchMock.restore();
  });

  it('should reject promise on network error', async () => {
    fetchMock.post(URS_URL, 504);

    try {
      await getUserRecommendations(exampleRequest, intl);
    } catch (error) {
      expect((error as any).message).toMatchSnapshot('URS error');
    }
  });

  it('should translate given context to correct fetch request', async () => {
    let requestBody;

    fetchMock.post(
      {
        functionMatcher: (url: string, options: any) => {
          requestBody = JSON.parse(options.body);

          return url === '/gateway/api/v1/recommendations';
        },
      },
      exampleResponse,
      {
        repeat: 1,
        overwriteRoutes: false,
      },
    );

    const users = await getUserRecommendations(exampleRequest, intl);

    expect(fetchMock.called()).toBeTruthy();
    expect(requestBody).toMatchSnapshot('URS query');
    expect(users).toMatchSnapshot('URS users');
  });
});
