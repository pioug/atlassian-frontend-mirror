import { profilecardData } from './profilecard-data';
import { random, getWeekday, getTimeString } from './util';

export function getMockProfilecardClient(
  BaseProfileClient: any,
  modifyResponse: any,
): any {
  return class MockProfileClient extends BaseProfileClient {
    // eslint-disable-next-line class-methods-use-this
    makeRequest(_cloudId: string, userId: string) {
      const timeout = random(1500) + 500;
      const matchError = userId.match(/^error:([0-9a-zA-Z\-]+)$/);
      const error = matchError && matchError[1];

      return new Promise((resolve, reject) => {
        window.setTimeout(() => {
          if (error) {
            return reject({ reason: error });
          }

          const profile = (profilecardData as any)[userId];

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
  };
}

export const simpleMockProfilecardClient = (modifyResponse: any) => ({
  getProfile: (cloudId: string, userId: string) => {
    const matchError = userId.match(/^error:([0-9a-zA-Z\-]+)$/);
    const error = matchError && matchError[1];

    if (error) {
      return Promise.reject({ reason: 'error' });
    }

    const profile = profilecardData[parseInt(userId, 10)];

    if (!profile) {
      return Promise.reject({ reason: 'default' });
    }

    const weekday = getWeekday();
    const data: any = { ...profile };
    data.remoteTimeString = getTimeString();
    data.remoteWeekdayIndex = weekday.index;
    data.remoteWeekdayString = weekday.string;

    return Promise.resolve(modifyResponse(data));
  },

  getTeamProfile: (orgId: string, teamId: string, analytics: any) => {
    return Promise.reject({ reason: 'not built yet' });
  },
});
