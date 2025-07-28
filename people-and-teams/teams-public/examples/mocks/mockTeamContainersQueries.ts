import fetchMock from 'fetch-mock/cjs/client';

const jiraProject = {
	node: {
		columns: [
			{
				key: 'container',
				value: {
					data: {
						__typename: 'JiraProject',
						id: '4',
						jiraProjectName: 'Jira Project',
						webUrl: 'https://example.com/jira',
						created: '2021-01-01',
						avatar: {
							medium:
								'https://avatar-management--avatars.us-west-2.staging.public.atl-paas.net/712020:2981defd-17f1-440e-a377-8c7657b72a6f/4b5b0d55-614b-4e75-858f-9da3d0c7e3f8/128',
						},
						projectType: 'software',
						projectTypeName: 'Software Project',
					},
				},
			},
		],
	},
};

const confluenceSpace = {
	node: {
		columns: [
			{
				key: 'container',
				value: {
					data: {
						__typename: 'ConfluenceSpace',
						id: '3',
						confluenceSpaceName: 'Confluence Space 2',
						type: 'confluence',
						createdDate: '2021-01-01',
						links: {
							base: 'https://example.com',
							webUi: '/confluence',
						},
						icon: {
							path: '/wiki/icon.png',
						},
					},
				},
			},
		],
	},
};

export const mockTeamContainersQueries = {
	data: () =>
		fetchMock.post({
			matcher: (url: string) => url.includes('/gateway/api/graphql?q=TeamContainersQueryV2'),
			response: () => {
				return {
					data: {
						graphStore: { cypherQueryV2: { edges: [jiraProject, confluenceSpace] } },
					},
				};
			},
			name: 'getTeamContainers',
			overwriteRoutes: true,
		}),
	delayedData: () => {
		fetchMock.post({
			matcher: (url: string) => url.includes('/gateway/api/graphql?q=TeamContainersQueryV2'),
			response: () => {
				return {
					data: {
						graphStore: { cypherQueryV2: { edges: [] } },
					},
				};
			},
			repeat: 1,
			name: 'getTeamContainersDelayedInitial',
			overwriteRoutes: true,
		});
		fetchMock.post({
			matcher: (url: string) => url.includes('/gateway/api/graphql?q=TeamContainersQueryV2'),
			response: () =>
				new Promise((resolve) => {
					setTimeout(() => {
						resolve({
							data: {
								graphStore: { cypherQueryV2: { edges: [jiraProject, confluenceSpace] } },
							},
						});
					}, 5000);
				}),
			name: 'getTeamContainersDelayed',
			overwriteRoutes: true,
		});
	},
	noData: () =>
		fetchMock.post({
			matcher: (url: string) => url.includes('/gateway/api/graphql?q=TeamContainersQueryV2'),
			response: () => {
				return {
					data: {
						graphStore: {
							cypherQueryV2: {
								edges: [],
							},
						},
					},
				};
			},
			name: 'getTeamContainersNoData',
			overwriteRoutes: true,
		}),
};
