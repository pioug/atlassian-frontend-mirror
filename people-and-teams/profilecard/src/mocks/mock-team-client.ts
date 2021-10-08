import TeamProfileCardClient from '../client/TeamProfileCardClient';
import { Team } from '../types';

export default function getMockTeamClient(data: {
  team: Team;
  timeout: number;
  error: any;
  errorRate: number;
}): any {
  return class MockTeamClient extends TeamProfileCardClient {
    makeRequest(teamId: string): Promise<Team> {
      if (!data.timeout) {
        if (data.error && Math.random() < data.errorRate) {
          return Promise.reject({ reason: data.error });
        }

        return Promise.resolve(data.team);
      }

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (data.error && Math.random() < data.errorRate) {
            reject({ reason: data.error });
          }

          return resolve(data.team);
        }, data.timeout);
      });
    }
  };
}
