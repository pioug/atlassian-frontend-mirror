import fetchMock from 'fetch-mock/cjs/client';

export const mockProfileData = {
	teamId: 'ari:cloud:identity::team/8ee37950-7de7-41ec-aee2-2c02c95949f4',
	displayName: 'THE SUPER TEAM',
	description:
		"Super team's super description - This is a very long line, adding more lines here to test the line limit of 3 that we enforce on the description of the team. In case the description very long, it should display an elipses at the end and hide that content that is overflowing",
	avatarImageUrl:
		'https://test-prod-issue-create.atlassian.net/wiki/download/attachments/35061761/SUP-default?version=1&modificationDate=1739217199215&cacheVersion=1&api=v2',
	headerImageUrl:
		'https://test-prod-issue-create.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10422?size=medium',
	memberAvatars: [
		{
			src: 'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/70121:c17bdf1f-39db-4611-a700-2f8c1aff841e/cf4058fd-75f2-4824-8041-c8efa4cc0ea8/128',
			name: 'Shrutha Kashyap',
			key: '70121:c17bdf1f-39db-4611-a700-2f8c1aff841e',
		},
		{
			src: 'https://secure.gravatar.com/avatar/189be88917ebf55b8c24642ca8bb3f38?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Fdefault-avatar-3.png',
			name: 'Confluence Analytics (System)',
			key: '557058:cbc04d7b-be84-46eb-90e4-e567aa5332c6',
		},
	],
	memberCount: 2,
	isVerified: true,
	teamProfileUrl:
		'https://test-prod-issue-create.atlassian.net/wiki/people/team/8ee37950-7de7-41ec-aee2-2c02c95949f4',
};

export const mockTeamContainersQueries = () => {
	fetchMock.post({
		matcher: (url: string) => url.includes('/gateway/api/graphql?q=TeamContainersQuery'),
		response: () => {
			return {
				data: {
					graphStore: {
						cypherQuery: {
							edges: [
								{
									node: {
										from: {
											id: '1',
										},
										to: {
											id: '2',
											data: {
												__typename: 'ConfluenceSpace',
												id: '2',
												confluenceSpaceName: 'Confluence Space',
												type: 'confluence',
												createdDate: '2021-01-01',
												links: {
													webUi: 'https://example.com/confluence',
												},
												icon: {
													path: 'https://avatar-management--avatars.us-west-2.staging.public.atl-paas.net/712020:2981defd-17f1-440e-a377-8c7657b72a6f/4b5b0d55-614b-4e75-858f-9da3d0c7e3f8/128',
												},
											},
										},
									},
								},
								{
									node: {
										from: {
											id: '1',
										},
										to: {
											id: '3',
											data: {
												__typename: 'ConfluenceSpace',
												id: '3',
												confluenceSpaceName: 'Confluence Space 2',
												type: 'confluence',
												createdDate: '2021-01-01',
												links: {
													webUi: 'https://example.com/confluence',
												},
												icon: {
													path: 'https://avatar-management--avatars.us-west-2.staging.public.atl-paas.net/712020:2981defd-17f1-440e-a377-8c7657b72a6f/4b5b0d55-614b-4e75-858f-9da3d0c7e3f8/128',
												},
											},
										},
									},
								},
								{
									node: {
										from: {
											id: '1',
										},
										to: {
											id: '4',
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
											},
										},
									},
								},
								{
									node: {
										from: {
											id: '1',
										},
										to: {
											id: '5',
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
											},
										},
									},
								},
								{
									node: {
										from: {
											id: '1',
										},
										to: {
											id: '6',
											data: {
												__typeName: 'JiraProject',
												id: '6',
												jiraProjectName: 'Jira Project 3',
												webUrl: 'https://example.com/jira',
												created: '2021-01-01',
												avatar: {
													medium:
														'https://avatar-management--avatars.us-west-2.staging.public.atl-paas.net/712020:2981defd-17f1-440e-a377-8c7657b72a6f/4b5b0d55-614b-4e75-858f-9da3d0c7e3f8/128',
												},
											},
										},
									},
								},
								{
									node: {
										from: {
											id: '1',
										},
										to: {
											id: '4',
											data: {
												__typename: 'ConfluenceSpace',
												id: '2',
												confluenceSpaceName: 'Confluence Space',
												type: 'confluence',
												createdDate: '2021-01-01',
												links: {
													webUi: 'https://example.com/confluence',
												},
												icon: {
													path: 'https://avatar-management--avatars.us-west-2.staging.public.atl-paas.net/712020:2981defd-17f1-440e-a377-8c7657b72a6f/4b5b0d55-614b-4e75-858f-9da3d0c7e3f8/128',
												},
											},
										},
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
