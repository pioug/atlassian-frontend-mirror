import { ActivityResource } from '@atlaskit/activity-provider';

import * as recentData from './mock-recent-data.json';

export default class MockActivityResource extends ActivityResource {
  constructor() {
    super('', '');
  }

  public async getRecentItems() {
    return Promise.resolve(recentData.data);
  }
}
