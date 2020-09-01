import fetchMock from 'fetch-mock/es5/client';

import ActivityResource from '../ActivityResource';
import { ActivityError } from '../error';

const activityUrl = '/graphql';
const cloudId = '123';

describe('ActivityError', () => {
  afterEach(fetchMock.restore);

  it('should throw ActivityError when activity request fails with 500', async () => {
    fetchMock.mock({
      matcher: activityUrl,
      response: 500,
      name: 'recent',
    });

    const provider = new ActivityResource(activityUrl, cloudId);

    await expect(provider.getRecentItems()).rejects.toThrow(ActivityError);
  });

  it('should throw ActivityError when activity request fails with 401', async () => {
    fetchMock.mock({
      matcher: activityUrl,
      response: 401,
      name: 'recent',
    });

    const provider = new ActivityResource(activityUrl, cloudId);

    await expect(provider.getRecentItems()).rejects.toThrow(ActivityError);
  });
});
