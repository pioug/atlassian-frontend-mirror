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
      const errorResponse = {
        reason: data.error?.reason,
        code: data.error?.code,
        source: data.error?.source,
        message: data.error?.message,
        traceId: data.error?.traceId,
      };
      if (!data.timeout) {
        if (data.error && Math.random() < data.errorRate) {
          return Promise.reject(errorResponse);
        }

        return Promise.resolve(data.team);
      }

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (data.error && Math.random() < data.errorRate) {
            reject(errorResponse);
          }

          return resolve(data.team);
        }, data.timeout);
      });
    }
  };
}
