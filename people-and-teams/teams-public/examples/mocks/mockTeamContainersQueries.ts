import fetchMock from 'fetch-mock/cjs/client';

import { type ContainerTypes } from '../../src/common/types';

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

const loomSpace = {
	node: {
		columns: [
			{
				key: 'container',
				value: {
					data: {
						__typename: 'LoomSpace',
						id: '5',
						loomSpaceName: 'Loom Space 1',
						type: 'loom',
						createdDate: '2021-01-01',
						links: {
							base: 'https://example.com',
							webUi: '/loom',
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
	data: (containerTypes: ContainerTypes[] = ['JiraProject', 'ConfluenceSpace', 'LoomSpace']): any =>
		fetchMock.post({
			matcher: (url: string) => url.includes('/gateway/api/graphql?q=TeamContainersQueryV2'),
			response: () => {
				const containers = containerTypes
					.map((type) => {
						switch (type) {
							case 'JiraProject':
								return jiraProject;
							case 'ConfluenceSpace':
								return confluenceSpace;
							case 'LoomSpace':
								return loomSpace;
							default:
								return null;
						}
					})
					.filter(Boolean);
				return {
					data: {
						graphStore: {
							cypherQueryV2: { edges: containers },
						},
					},
				};
			},
			name: 'getTeamContainers',
			overwriteRoutes: true,
		}),
	noData: (): any =>
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
