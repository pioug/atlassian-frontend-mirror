import TeamProfileCardClient from '../src/api/TeamProfileCardClient';

import { Team } from '../src/types';

export default function getMockTeamClient(data: {
  team: Team;
  timeout: number;
  error: any;
  errorRate: number;
}) {
  return class MockTeamClient extends TeamProfileCardClient {
    makeRequest(teamId: string): Promise<Team> {
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
