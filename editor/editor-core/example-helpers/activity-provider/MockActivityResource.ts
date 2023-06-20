import { ActivityResource } from '@atlaskit/activity-provider';

import recentData from './mock-recent-data';

export default class MockActivityResource extends ActivityResource {
  constructor() {
    super('', '');
  }

  public async getRecentItems() {
    // Type cast here because the activity provider `getRecentItems` has its return type inferred and is actually
    // stricter / misaligned with the exported type `ActivityItem`
    // I am not updating the `@atlaskit/activity-provider` because to correct the type could be considered a breaking change
    // and not worth the risk for a test
    return Promise.resolve(recentData.data as any);
  }
}
