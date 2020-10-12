import fetchMock from 'fetch-mock/cjs/client';
import { fetchJoinableSites } from '../../default-joinable-sites-fetch';
import { ProductKey } from '../../../../types';

describe('default-joinable-sites-fetch', () => {
  const experimentApiSites = {
    sites: [
      {
        cloudId: 'cloud-1',
        url: 'https://teamsinspace.com',
        products: {
          'jira-software.ondemand': [],
        },
        displayName: 'Example',
        avatarUrl: 'http://avatarSite/avatar',
        relevance: 0,
      },
    ],
  };

  test('should return error when fetch could not retrieve data', async () => {
    fetchMock.post(`/trello-cross-product-join/recommended-sites`, 400);

    // Apparently you have to wrap in a try catch -> https://github.com/facebook/jest/issues/1700
    async function testFetch() {
      try {
        await fetchJoinableSites([ProductKey.JIRA_SOFTWARE]);
      } catch (e) {
        throw new Error('testFetchError');
      }
    }

    await expect(testFetch()).rejects.toThrow(Error);
  });

  test('should return joinable sites when fetch succeeds', async () => {
    fetchMock.post(
      `/trello-cross-product-join/recommended-sites`,
      experimentApiSites,
      { method: 'POST', overwriteRoutes: true },
    );

    const joinableSites = await fetchJoinableSites([ProductKey.JIRA_SOFTWARE]);
    expect(joinableSites).toStrictEqual(experimentApiSites);
  });
});
