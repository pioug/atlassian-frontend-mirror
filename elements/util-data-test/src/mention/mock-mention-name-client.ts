import {
  MentionNameClient,
  MentionNameDetails,
  MentionNameStatus,
} from '@atlaskit/mention/resource';
import debug from '../logger';

export class MockMentionNameClient implements MentionNameClient {
  constructor() {}

  getLookupLimit() {
    return 10;
  }

  lookupMentionNames(ids: string[]): Promise<MentionNameDetails[]> {
    debug('lookupMentionNames', ids);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          ids.map<MentionNameDetails>(id => {
            if (id === 'unknown') {
              return {
                id,
                status: MentionNameStatus.UNKNOWN,
              };
            }
            if (id === 'service_error') {
              return {
                id,
                status: MentionNameStatus.SERVICE_ERROR,
              };
            }
            return {
              id,
              name: `Hydrated ${id} name`,
              status: MentionNameStatus.OK,
            };
          }),
        );
      }, 1500);
    });
  }
}
