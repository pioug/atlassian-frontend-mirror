export const MOCK_TEAM_CONTAINERS = {
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
								confluenceSpaceName: 'Confluence Space',
								type: 'confluence',
								createdDate: '2021-01-01',
								links: {
									webUi: 'web-link',
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
								__typename: 'JiraProject',
								jiraProjectName: 'Jira Project',
								webUrl: 'web-link',
								created: '2021-01-01',
								avatar: {
									medium:
										'https://avatar-management--avatars.us-west-2.staging.public.atl-paas.net/712020:2981defd-17f1-440e-a377-8c7657b72a6f/4b5b0d55-614b-4e75-858f-9da3d0c7e3f8/128',
								},
							},
						},
					},
				},
			],
		},
	},
};
