import fetchMock from 'fetch-mock/cjs/client';

import { type ContainerType } from '@atlaskit/teams-client/types';

const mockCreateTeam = {
	success: (
		created: ContainerType[] = [],
		notCreated: { containerType: ContainerType; reason: string }[] = [],
	) => {
		fetchMock.post({
			matcher: (url: string) => url.includes('/gateway/api/v4/teams/containers'),
			response: () => {
				return {
					containersCreated: created.map((type) => ({
						containerId: `ari:cloud:${type.toLowerCase()}::site/123-456-789`,
						containerName: `${type} Name`,
						containerSideId: '123-456-789',
						containerType: type,
						containerUrl: 'https://atlassian.com/',
					})),
					containersNotCreated: notCreated,
				};
			},
		});
	},
	error: (status: number = 400) =>
		fetchMock.post({
			matcher: (url: string) => url.includes('/gateway/api/v4/teams/containers'),
			response: () => ({
				status,
				body: {},
			}),
		}),
};

export { mockCreateTeam };
