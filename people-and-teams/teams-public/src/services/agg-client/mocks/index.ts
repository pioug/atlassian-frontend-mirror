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

export const MOCK_CONNECTED_TEAMS = {
	graphStore: {
		teamConnectedToContainerInverse: {
			edges: [
				{
					node: {
						id: 'ari:cloud:identity::team/8ee37950-7de7-41ec-aee2-2c02c95949f4',
						description: "Super team's super description",
						displayName: 'THE SUPER TEAM',
						smallAvatarImageUrl:
							'https://ptc-directory-sited-static.us-east-1.prod.public.atl-paas.net/teams/avatars/0.svg',
						smallHeaderImageUrl:
							'https://ptc-directory-sited-static.us-east-1.prod.public.atl-paas.net/gradients/0.svg',
						largeAvatarImageUrl:
							'https://ptc-directory-sited-static.us-east-1.prod.public.atl-paas.net/teams/avatars/0.svg',
						largeHeaderImageUrl:
							'https://ptc-directory-sited-static.us-east-1.prod.public.atl-paas.net/gradients/0.svg',
						members: {
							nodes: [
								{
									role: 'ADMIN',
									state: 'FULL_MEMBER',
									member: {
										name: 'Shrutha Kashyap',
										picture:
											'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/70121:c17bdf1f-39db-4611-a700-2f8c1aff841e/cf4058fd-75f2-4824-8041-c8efa4cc0ea8/128',
										accountStatus: 'active',
										extendedProfile: {
											jobTitle: 'Full Stack Software Engineer',
										},
										id: 'ari:cloud:identity::user/70121:c17bdf1f-39db-4611-a700-2f8c1aff841e',
									},
								},
							],
							pageInfo: {
								endCursor: null,
								hasNextPage: false,
							},
						},
						organizationId: 'ari:cloud:platform::org/434kbc65-c30c-1a22-6933-d25085c532ca',
						membershipSettings: 'MEMBER_INVITE',
						isVerified: false,
						state: 'ACTIVE',
						creator: {
							id: 'ari:cloud:identity::user/70121:c17bdf1f-39db-4611-a700-2f8c1aff841e',
						},
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
