import fetchMock from 'fetch-mock/cjs/client';

export const mockTeamContainersQueries = () => {
	fetchMock.post({
		matcher: (url: string) => url.includes('/gateway/api/graphql?q=TeamContainersQueryV2'),
		response: () => {
			return {
				data: {
					graphStore: {
						cypherQueryV2: {
							edges: [
								{
									node: {
										columns: [
											{
												key: 'container',
												value: {
													data: {
														__typename: 'ConfluenceSpace',
														id: '2',
														confluenceSpaceName: 'Confluence Space',
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
								},
								{
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
								},
								{
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
								},
								{
									node: {
										columns: [
											{
												key: 'container',
												value: {
													data: {
														__typename: 'JiraProject',
														id: '5',
														jiraProjectName: 'Jira Project 2',
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
								},
								{
									node: {
										columns: [
											{
												key: 'container',
												value: {
													data: {
														__typename: 'JiraProject',
														id: '6',
														jiraProjectName: 'Jira Project 3',
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
								},
							],
						},
					},
				},
			};
		},
		name: 'getTeamContainers',
		overwriteRoutes: true,
	});
};
