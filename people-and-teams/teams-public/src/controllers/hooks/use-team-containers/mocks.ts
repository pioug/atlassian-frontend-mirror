// Mock data for tests
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

export const MOCK_TEAM_CONTAINERSV2 = {
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
											webUi: '/wiki/spaces/SPACE',
										},
										icon: {
											path: '/wiki/download/attachments/123/icon.png',
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
										id: '3',
										jiraProjectName: 'Jira Project',
										webUrl: 'https://example.com/jira/project',
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
};

export const MOCK_CONNECTED_TEAMS_RESULT = [
	{
		id: 'ari:cloud:identity::team/8ee37950-7de7-41ec-aee2-2c02c95949f4',
		displayName: 'THE SUPER TEAM',
		description: "Super team's super description",
		state: 'ACTIVE',
		membershipSettings: 'MEMBER_INVITE',
		organizationId: 'ari:cloud:platform::org/434kbc65-c30c-1a22-6933-d25085c532ca',
		creatorId: 'ari:cloud:identity::user/70121:c17bdf1f-39db-4611-a700-2f8c1aff841e',
		isVerified: false,
		members: [
			{
				id: '70121:c17bdf1f-39db-4611-a700-2f8c1aff841e',
				fullName: 'Shrutha Kashyap',
				avatarUrl:
					'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/70121:c17bdf1f-39db-4611-a700-2f8c1aff841e/cf4058fd-75f2-4824-8041-c8efa4cc0ea8/128',
				status: 'active',
			},
		],
		includesYou: false,
		memberCount: 1,
		smallAvatarImageUrl:
			'https://ptc-directory-sited-static.us-east-1.prod.public.atl-paas.net/teams/avatars/0.svg',
		smallHeaderImageUrl:
			'https://ptc-directory-sited-static.us-east-1.prod.public.atl-paas.net/gradients/0.svg',
		largeAvatarImageUrl:
			'https://ptc-directory-sited-static.us-east-1.prod.public.atl-paas.net/teams/avatars/0.svg',
		largeHeaderImageUrl:
			'https://ptc-directory-sited-static.us-east-1.prod.public.atl-paas.net/gradients/0.svg',
		restriction: 'ORG_MEMBERS',
	},
];
