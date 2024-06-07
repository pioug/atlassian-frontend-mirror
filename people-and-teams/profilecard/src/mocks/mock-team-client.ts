import { handleAGGErrors } from '../client/errorUtils';
import TeamProfileCardClient from '../client/TeamProfileCardClient';
import { type Team } from '../types';

export default function getMockTeamClient(data: {
	team: Team;
	timeout: number;
	error: any;
	errorRate: number;
	traceId: string;
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
					try {
						handleAGGErrors(data.error, data.traceId);
					} catch (e) {
						return Promise.reject(e);
					}
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
