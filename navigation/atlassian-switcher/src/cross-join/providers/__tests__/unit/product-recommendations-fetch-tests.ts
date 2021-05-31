import fetchMock from 'fetch-mock/cjs/client';
import { fetchProductRecommendationsInternal } from '../../product-recommendations-fetch';

describe('product-recommendations-fetch-test', () => {
  const productRecommendationsApiReponse = {
    capability: {
      DIRECT_ACCESS: [
        {
          resourceId:
            'ari:cloud:jira-software::site/11112222-3333-4444-5555-666677778888',
          userAccessLevel: 'EXTERNAL',
          roleAri: 'ari:cloud:jira-software::role/product/member',
          url:
            'https://example.jira-dev.com/secure/BrowseProjects.jspa?selectedProjectType=software',
          displayName: 'example',
          avatarUrl:
            'https://site-admin-avatar-cdn.staging.public.atl-paas.net/avatars/240/lightbulb.png',
        },
        {
          resourceId:
            'ari:cloud:confluence::site/11112222-3333-4444-5555-666677778888',
          userAccessLevel: 'EXTERNAL',
          roleAri: 'ari:cloud:confluence::role/product/member',
          url: 'https://example.jira-dev.com/wiki',
          displayName: 'example',
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
        cloudId: '11112222-3333-4444-5555-666677778888',
        url: 'https://example.jira-dev.com',
        displayName: 'example',
        relevance: 1000,
        products: {
          'jira-software.ondemand': {
            collaborators: [],
            productUrl:
              'https://example.jira-dev.com/secure/BrowseProjects.jspa?selectedProjectType=software',
          },
          'confluence.ondemand': {
            collaborators: [],
            productUrl: 'https://example.jira-dev.com/wiki',
          },
        },
      },
    ],
  };

  const emptyJoinableSiteResponse = { sites: [] };

  afterEach(fetchMock.restore);

  test('should return error when fetch could not retrieve data', async () => {
    fetchMock.get(
      'https://example.com/v1/product-recommendations?capability=DIRECT_ACCESS&product=jira-software&product=jira-servicedesk&product=jira-core&product=confluence',
      400,
    );

    // Apparently you have to wrap in a try catch -> https://github.com/facebook/jest/issues/1700
    async function testFetch() {
      try {
        await fetchProductRecommendationsInternal('https://example.com');
      } catch (e) {
        throw new Error('testFetchError');
      }
    }

    await expect(testFetch()).rejects.toThrow(Error);
  });

  test('should return joinable sites when fetch succeeds', async () => {
    fetchMock.get(
      'https://example.com/v1/product-recommendations?capability=DIRECT_ACCESS&product=jira-software&product=jira-servicedesk&product=jira-core&product=confluence',
      new Response(JSON.stringify(productRecommendationsApiReponse), {
        status: 200,
        statusText: 'ok',
      }),
    );

    return fetchProductRecommendationsInternal('https://example.com').then(
      (joinableSitesResponse) => {
        expect(joinableSitesResponse).toStrictEqual(joinableSitesApiResponse);
      },
    );
  });

  test('should return empty joinable sites when fetch returns 400 "Request requires a domain which is not public"', async () => {
    fetchMock.get(
      'https://example.com/v1/product-recommendations?capability=DIRECT_ACCESS&product=jira-software&product=jira-servicedesk&product=jira-core&product=confluence',
      new Response(
        JSON.stringify({
          code: 'email-public-domain',
          message: 'Request requires a domain which is not public',
        }),
        {
          status: 400,
        },
      ),
    );

    return fetchProductRecommendationsInternal('https://example.com').then(
      (joinableSitesResponse) => {
        expect(joinableSitesResponse).toEqual(emptyJoinableSiteResponse);
      },
    );
  });
});
