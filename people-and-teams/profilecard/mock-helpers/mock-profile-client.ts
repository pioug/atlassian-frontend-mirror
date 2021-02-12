import UserProfileCardClient from '../src/api/UserProfileCardClient';
import { ClientOverrides, ProfileClientOptions } from '../src/types';

import profiles from './profile-data';
import { getTimeString, getWeekday, random } from './util';

export default function getMockProfileClient(
  BaseProfileClient: any,
  modifyResponse: any,
): any {
  class MockUserClient extends UserProfileCardClient {
    makeRequest(cloudId: string, userId: string) {
      const timeout = random(1500) + 500;
      const matchError = userId.match(/^error:([0-9a-zA-Z\-]+)$/);
      const error = matchError && matchError[1];

      return new Promise<any>((resolve, reject) => {
        setTimeout(() => {
          if (error) {
            return reject({ reason: error });
          }

          const userIdAsIndex = parseInt(userId, 10);
          const profile = profiles[userIdAsIndex] || profiles[0];

          if (!profile) {
            return reject({ reason: 'default' });
          }

          const weekday = getWeekday();
          const data: any = { ...profile };

          data.remoteTimeString = getTimeString();
          data.remoteWeekdayIndex = weekday.index;
          data.remoteWeekdayString = weekday.string;

          return resolve(modifyResponse(data));
        }, timeout);
      });
    }
  }

  return class MockProfileClient extends BaseProfileClient {
    constructor(options: ProfileClientOptions, clients: ClientOverrides = {}) {
      super(options, {
        userClient: new MockUserClient(options),
        ...clients,
      });
    }
  };
}
