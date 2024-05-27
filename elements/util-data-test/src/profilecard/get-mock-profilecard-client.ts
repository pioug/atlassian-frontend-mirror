import { modifyResponse } from '@atlaskit/profilecard';
import { type ProfileClient } from '@atlaskit/profilecard/types';
import {
  type ProfileCardClientData,
  type ReportingLinesUser,
  type Team,
  type TeamCentralReportingLinesData,
} from '@atlaskit/profilecard/types';

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

const getMockProfile = (userId: string) => {
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

  return Promise.resolve(data);
};

// TODO: This function will replace getMockProfilecardClient() on line 13 once the latest `master` branch containing this code has been merged to `develop`
export function simpleMockProfilecardClient(): ProfileClient {
  return {
    flushCache: () => undefined,

    getProfile: async (
      _cloudId: string,
      userId: string,
    ): Promise<ProfileCardClientData> => {
      const timeout = random(1500) + 500;

      return new Promise((resolve, reject) => {
        window.setTimeout(async () => {
          getMockProfile(userId)
            .then(data => resolve(modifyResponse(data)))
            .catch(error => reject(error));
        }, timeout);
      });
    },

    getTeamProfile: (
      _teamId: string,
      _orgId?: string,
      _analytics?: (event: Record<string, any>) => void,
    ): Promise<Team> => {
      return Promise.reject({ reason: 'not built yet' });
    },

    getReportingLines: (
      _userId: string,
    ): Promise<TeamCentralReportingLinesData> => {
      const reportingLinesUsers: ReportingLinesUser[] = profilecardData.map(
        (user, index) => ({
          accountIdentifier: '123456:12345-67890-' + index,
          identifierType: 'ATLASSIAN_ID',
          pii: {
            name: user.User.fullName,
            picture: user.User.avatarUrl,
          },
        }),
      );
      const halfCount = Math.ceil(reportingLinesUsers.length / 2);
      return Promise.resolve({
        managers: reportingLinesUsers.slice(0, halfCount),
        reports: reportingLinesUsers.slice(-halfCount),
      });
    },

    getTeamCentralBaseUrl: () => 'teamCentralUrl',

    shouldShowGiveKudos: () => Promise.resolve(true),
  };
}
