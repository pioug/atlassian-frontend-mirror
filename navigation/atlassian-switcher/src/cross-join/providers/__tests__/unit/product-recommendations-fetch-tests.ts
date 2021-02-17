import fetchMock from 'fetch-mock/cjs/client';
import { fetchProductRecommendationsInternal } from '../../product-recommendations-fetch';

describe('product-recommendations-fetch-test', () => {
  const productRecommendationsApiReponse = {
    capability: {
      DIRECT_ACCESS: [
        {
          resourceId:
            'ari:cloud:jira-software::site/bd98310f-491e-4af3-89a1-a23c6a9db606',
          userAccessLevel: 'EXTERNAL',
          roleAri: 'ari:cloud:jira-software::role/product/member',
          url:
            'https://recommendations1.jira-dev.com/secure/BrowseProjects.jspa?selectedProjectType=software',
          displayName: 'recommendations1',
          avatarUrl:
            'https://site-admin-avatar-cdn.staging.public.atl-paas.net/avatars/240/lightbulb.png',
        },
      ],
    },
  };

  // Expected JoinableSitesResponse given the above productRecommendationsResponse
  const joinableSitesApiResponse = {
    sites: [
      {
        cloudId: 'bd98310f-491e-4af3-89a1-a23c6a9db606',
        url: 'https://recommendations1.jira-dev.com',
        displayName: 'recommendations1',
        relevance: 1000,
        products: {
          'jira-software.ondemand': {
            collaborators: [],
            productUrl:
              'https://recommendations1.jira-dev.com/secure/BrowseProjects.jspa?selectedProjectType=software',
          },
        },
      },
    ],
  };

  afterEach(fetchMock.restore);

  test('should return error when fetch could not retrieve data', async () => {
    fetchMock.get(
      '/v1/product-recommendations?capability=DIRECT_ACCESS&product=jira-software&product=jira-servicedesk&product=jira-core&product=confluence',
      400,
    );

    // Apparently you have to wrap in a try catch -> https://github.com/facebook/jest/issues/1700
    async function testFetch() {
      try {
        await fetchProductRecommendationsInternal();
      } catch (e) {
        throw new Error('testFetchError');
      }
    }

    await expect(testFetch()).rejects.toThrow(Error);
  });

  test('should return joinable sites when fetch succeeds', async () => {
    fetchMock.get(
      '/v1/product-recommendations?capability=DIRECT_ACCESS&product=jira-software&product=jira-servicedesk&product=jira-core&product=confluence',
      productRecommendationsApiReponse,
    );

    const joinableSites = await fetchProductRecommendationsInternal();
    expect(joinableSites).toStrictEqual(joinableSitesApiResponse);
  });
});
