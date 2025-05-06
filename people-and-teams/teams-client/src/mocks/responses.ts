import { type TeamMembershipQueryResponse } from '../services/agg-client/utils/queries/team-membership-query';
import { type RecommendationsResponse } from '../services/invitations-client/types';
import { type LegionTeamGetResponseV4 } from '../services/legion-client/types';
import { type TeamMembership } from '../types';

import avatar1 from './images/avatar-1.png';
import avatar2 from './images/avatar-2.png';
import avatar3 from './images/avatar-3.png';
import avatar4 from './images/avatar-4.png';
import avatar5 from './images/avatar-5.png';

const CURRENT_USER_TEST_ID = '60eee7cec94cc20068ac280c';

export const MOCK_ME_RESPONSE = {
	email: 'cypress_test_user@atlassian.com',
	nickname: 'cypress_test_user',
	characteristics: {
		not_mentionable: null,
	},
	extended_profile: {
		job_title: 'test job title',
		organization: 'test org',
		department: 'test department',
		location: 'test location',
	},
	account_id: CURRENT_USER_TEST_ID,
	name: "Alexander O'Shannessy",
	zoneinfo: 'Australia/Sydney',
	locale: 'en-US',
	privacy_settings: {
		name: 'private',
		nickname: 'public',
		picture: 'private',
		job_title: 'private',
		department: 'private',
		organization: 'private',
		location: 'private',
		zoneinfo: 'private',
		email: 'private',
		phone_number: 'private',
		team_type: 'private',
	},
	picture: avatar4,
	account_type: 'atlassian',
	account_status: 'active',
};

export const MOCK_PROFILE_MUTABILITY_RESPONSE = {
	account_id: CURRENT_USER_TEST_ID,
	account_type: 'atlassian',
	account_status: 'active',
	characteristics: {
		not_mentionable: null,
	},
	email: 'cypress_test_user@atlassian.com',
	extended_profile: {
		job_title: 'test job title',
		organization: 'test org',
		department: 'test department',
		location: 'test location',
	},
	locale: 'en-US',
	last_updated: '2024-02-16T01:37:53.149Z',
	name: "Alexander O'Shannessy",
	nickname: 'cypress_test_user',
	not_editable: [
		{
			field: 'email',
			reason: 'ext.dir.scim',
		},
		{
			field: 'name',
			reason: 'ext.dir.scim',
		},
	],
	picture: avatar4,
};

const defaultMyMembership: TeamMembership = {
	membershipId: {
		teamId: '73fd6ba8-ce60-497c-94b3-8f5d04a6b5df',
		memberId: CURRENT_USER_TEST_ID,
	},
	state: 'FULL_MEMBER',
	role: 'REGULAR',
};

export const MOCK_MEMBERS_ME_MEMBER_RESPONSE: TeamMembership = {
	...defaultMyMembership,
	state: 'FULL_MEMBER',
	role: 'REGULAR',
};

export const MOCK_MEMBERS_ME_ADMIN_RESPONSE: TeamMembership = {
	...defaultMyMembership,
	state: 'FULL_MEMBER',
	role: 'ADMIN',
};

export const MOCK_MEMBERS_ME_REQUESTING_RESPONSE: TeamMembership = {
	...defaultMyMembership,
	state: 'REQUESTING_TO_JOIN',
	role: 'REGULAR',
};

export const MOCK_TEAM_MEMBERSHIP_RESPONSE: {
	data: { team: TeamMembershipQueryResponse };
} = {
	data: {
		team: {
			teamV2: {
				members: {
					edges: [
						{
							node: {
								role: 'REGULAR',
								state: 'FULL_MEMBER',
								member: {
									name: 'Diego Berrueta Munoz',
									picture: avatar1,
									accountStatus: 'active',
									extendedProfile: {
										jobTitle: 'Engineering Principal',
									},
									id: 'ari:cloud:identity::user/557057:64fea9cd-cac4-484c-afe6-a2391323fd7b',
								},
							},
						},
						{
							node: {
								role: 'REGULAR',
								state: 'FULL_MEMBER',
								member: {
									name: 'Jeremy Evans',
									picture: avatar2,
									accountStatus: 'active',
									extendedProfile: {
										jobTitle: 'Senior Developer',
									},
									id: 'ari:cloud:identity::user/557057:d2fe4234-9c00-4cfd-958e-3b1ded09d649',
								},
							},
						},
						{
							node: {
								role: 'REGULAR',
								state: 'FULL_MEMBER',
								member: {
									name: 'Lap Tran',
									picture: avatar3,
									accountStatus: 'active',
									extendedProfile: {
										jobTitle: 'Senior Developer',
									},
									id: 'ari:cloud:identity::user/557058:abff3c19-08a5-4edc-b07a-6f43f24984fe',
								},
							},
						},
						{
							node: {
								role: 'REGULAR',
								state: 'FULL_MEMBER',
								member: {
									name: 'Ishan Somasiri',
									picture: avatar4,
									accountStatus: 'active',
									extendedProfile: {
										jobTitle: 'Senior Software Engineer',
									},
									id: 'ari:cloud:identity::user/5aa86d9da903362a5788ce55',
								},
							},
						},
						{
							node: {
								role: 'REGULAR',
								state: 'FULL_MEMBER',
								member: {
									name: 'Mark Catanzariti',
									picture: avatar5,
									accountStatus: 'active',
									extendedProfile: {
										jobTitle: 'Senior Designer',
									},
									id: 'ari:cloud:identity::user/5bfe16d25f77da6929584c11',
								},
							},
						},
						{
							node: {
								role: 'REGULAR',
								state: 'FULL_MEMBER',
								member: {
									name: 'William Pan',
									picture: avatar1,
									accountStatus: 'active',
									extendedProfile: {
										jobTitle: 'Software Engineer',
									},
									id: 'ari:cloud:identity::user/5e15a1ff5361330daaeb2d19',
								},
							},
						},
						{
							node: {
								role: 'REGULAR',
								state: 'FULL_MEMBER',
								member: {
									name: 'Yerbol Nisanbayev',
									picture: avatar1,
									accountStatus: 'active',
									extendedProfile: {
										jobTitle: 'Senior Product Manager, Connective Collaboration',
									},
									id: 'ari:cloud:identity::user/5e1ee29ab5771b0ca441bf6f',
								},
							},
						},
						{
							node: {
								role: 'REGULAR',
								state: 'FULL_MEMBER',
								member: {
									name: 'Maddy Bhat',
									picture: avatar1,
									accountStatus: 'active',
									extendedProfile: {
										jobTitle: 'Software Engineer',
									},
									id: 'ari:cloud:identity::user/60cac25300bdd900682e872c',
								},
							},
						},
						{
							node: {
								role: 'REGULAR',
								state: 'FULL_MEMBER',
								member: {
									name: "Alexander O'Shannessy",
									picture: avatar1,
									accountStatus: 'active',
									extendedProfile: {
										jobTitle: 'Senior Software Engineer',
									},
									id: 'ari:cloud:identity::user/60eee7cec94cc20068ac280c',
								},
							},
						},
						{
							node: {
								role: 'REGULAR',
								state: 'FULL_MEMBER',
								member: {
									name: 'Vernon Laquindanum',
									picture: avatar1,
									accountStatus: 'active',
									extendedProfile: {
										jobTitle: 'Senior Content Designer',
									},
									id: 'ari:cloud:identity::user/60eeec6bf749c4006801261b',
								},
							},
						},
						{
							node: {
								role: 'REGULAR',
								state: 'FULL_MEMBER',
								member: {
									name: 'Nancy Watta',
									picture: avatar1,
									accountStatus: 'active',
									extendedProfile: {
										jobTitle: 'Software Engineer',
									},
									id: 'ari:cloud:identity::user/6138bd3e70405d0068f56f46',
								},
							},
						},
						{
							node: {
								role: 'REGULAR',
								state: 'FULL_MEMBER',
								member: {
									name: 'Elly Whisson',
									picture: avatar1,
									accountStatus: 'active',
									extendedProfile: {
										jobTitle: 'Software Engineer',
									},
									id: 'ari:cloud:identity::user/6179589c20972200712f7598',
								},
							},
						},
						{
							node: {
								role: 'REGULAR',
								state: 'FULL_MEMBER',
								member: {
									name: 'Hars Patel',
									picture: avatar1,
									accountStatus: 'active',
									extendedProfile: {
										jobTitle: 'Software Engineer',
									},
									id: 'ari:cloud:identity::user/617958f3b9c549006fecee1b',
								},
							},
						},
						{
							node: {
								role: 'REGULAR',
								state: 'FULL_MEMBER',
								member: {
									name: 'Joe Nguyen',
									picture: avatar1,
									accountStatus: 'active',
									extendedProfile: {
										jobTitle: 'Associate Product Manager',
									},
									id: 'ari:cloud:identity::user/63be70262341bff4fff6777a',
								},
							},
						},
						{
							node: {
								role: 'REGULAR',
								state: 'FULL_MEMBER',
								member: {
									name: 'Qiang Zeng',
									picture: avatar1,
									accountStatus: 'active',
									extendedProfile: {
										jobTitle: 'Software Engineer',
									},
									id: 'ari:cloud:identity::user/70121:51907613-4f26-4701-9b29-b2e2298c0f94',
								},
							},
						},
						{
							node: {
								role: 'REGULAR',
								state: 'FULL_MEMBER',
								member: {
									name: 'Cecily Shen',
									picture: avatar1,
									accountStatus: 'active',
									extendedProfile: {
										jobTitle: 'Software Engineer',
									},
									id: 'ari:cloud:identity::user/70121:7220b420-d2fb-462d-84fd-2c5158a7eab7',
								},
							},
						},
						{
							node: {
								role: 'REGULAR',
								state: 'FULL_MEMBER',
								member: {
									name: 'Leon Messerschmidt',
									picture: avatar1,
									accountStatus: 'active',
									extendedProfile: {
										jobTitle: 'Senior Engineering Manager',
									},
									id: 'ari:cloud:identity::user/70121:8527401f-d3c5-42ce-9c0f-53cd4c9d88ed',
								},
							},
						},
						{
							node: {
								role: 'REGULAR',
								state: 'FULL_MEMBER',
								member: {
									name: 'Arezoo Taslimi',
									picture: avatar1,
									accountStatus: 'active',
									extendedProfile: {
										jobTitle: 'Software Engineer',
									},
									id: 'ari:cloud:identity::user/70121:bb7b2980-1dbe-456c-bd2c-7bdc76825f25',
								},
							},
						},
						{
							node: {
								role: 'REGULAR',
								state: 'FULL_MEMBER',
								member: {
									name: 'Kavi Lal',
									picture: avatar1,
									accountStatus: 'active',
									extendedProfile: {
										jobTitle: 'Principal Product Manager - Atlas',
									},
									id: 'ari:cloud:identity::user/712020:b065019f-8f12-4022-9c59-4683456b816c',
								},
							},
						},
						{
							node: {
								role: 'REGULAR',
								state: 'FULL_MEMBER',
								member: {
									name: 'Chloe Wong',
									picture: avatar1,
									accountStatus: 'active',
									extendedProfile: {
										jobTitle: 'Software Engineer',
									},
									id: 'ari:cloud:identity::user/712020:da03c954-3e2f-4f6b-8eb7-a931480e1945',
								},
							},
						},
						{
							node: {
								role: 'REGULAR',
								state: 'FULL_MEMBER',
								member: {
									name: 'Megan Kwai',
									picture: avatar1,
									accountStatus: 'active',
									extendedProfile: {
										jobTitle: 'Intern Developer',
									},
									id: 'ari:cloud:identity::user/712020:ddea0364-027d-477f-b66a-96a5c2b68195',
								},
							},
						},
						// AGENT
						{
							node: {
								role: 'REGULAR',
								state: 'FULL_MEMBER',
								member: {
									name: 'James Bond',
									picture: avatar1,
									accountStatus: 'active',
									extendedProfile: {
										jobTitle: 'Engineering Principal',
									},
									appType: 'agent',
									id: 'ari:cloud:identity::user/712020:ddea0364-027d-477f-b66a-96a5c2b68007',
								},
							},
						},
					],
					pageInfo: {
						endCursor: null,
						hasNextPage: false,
					},
				},
			},
		},
	},
};

const defaultTeam: LegionTeamGetResponseV4 = {
	permission: 'FULL_READ',
	id: 'ari:cloud:teams::team/73fd6ba8-ce60-497c-94b3-8f5d04a6b5df',
	description: 'quack quack',
	displayName: 'RW - Mightyducks',
	state: 'ACTIVE',
	membershipSettings: 'MEMBER_INVITE',
	organizationId: '2346a038-3c8c-498b-a79b-e7847859868d',
	creatorId: '557058:8fc2a511-5b21-46b7-a88f-19bbb4c7be4b',
	scopeMode: 'ORG_SCOPE_MODE',
	isVerified: false,
	largeHeaderImageUrl:
		'https://ptc-directory-sited-static.us-east-1.prod.public.atl-paas.net/gradients/5.svg',
	smallHeaderImageUrl:
		'https://ptc-directory-sited-static.us-east-1.prod.public.atl-paas.net/gradients/5.svg',
	largeAvatarImageUrl:
		'https://ptc-directory-sited-static.us-east-1.prod.public.atl-paas.net/teams/avatars/5.svg',
	smallAvatarImageUrl:
		'https://ptc-directory-sited-static.us-east-1.prod.public.atl-paas.net/teams/avatars/5.svg',
};

export const MOCK_INVITE_ONLY_TEAM_RESPONSE: LegionTeamGetResponseV4 = {
	...defaultTeam,
	permission: 'FULL_READ',
	membershipSettings: 'MEMBER_INVITE',
};

export const MOCK_EXTERNAL_TEAM_RESPONSE: LegionTeamGetResponseV4 = {
	...defaultTeam,
	permission: 'FULL_READ',
	membershipSettings: 'EXTERNAL',
};

export const MOCK_INVITE_ONLY_TEAM_WRITE_PERMISSION_RESPONSE: LegionTeamGetResponseV4 = {
	...defaultTeam,
	permission: 'FULL_WRITE',
	membershipSettings: 'MEMBER_INVITE',
};

export const MOCK_OPEN_TEAM_RESPONSE: LegionTeamGetResponseV4 = {
	...defaultTeam,
	permission: 'FULL_READ',
	membershipSettings: 'OPEN',
};

export const MOCK_OPEN_TEAM_WRITE_PERMISSION_RESPONSE: LegionTeamGetResponseV4 = {
	...defaultTeam,
	permission: 'FULL_WRITE',
	membershipSettings: 'OPEN',
};

export const MOCK_PRODUCT_RECOMMENDATIONS_RESPONSE: RecommendationsResponse = {
	capability: {
		REQUEST_ACCESS: [
			{
				resourceId: 'ari:cloud:jira-software::site/dcf879ee-1c1f-4851-9451-6e4c3a13fa47',
				userAccessLevel: 'INTERNAL',
				mode: 'OPEN',
				roleAri: 'ari:cloud:jira-software::role/product/member',
				url: 'https://test.jira-dev.com/secure/BrowseProjects.jspa?selectedProjectType=software',
				displayName: 'Request access to Jira Software',
				avatarUrl:
					'https://site-admin-avatar-cdn.staging.public.atl-paas.net/avatars/240/trophy.png',
			},
		],
		DIRECT_ACCESS: [
			{
				resourceId: 'ari:cloud:confluence::site/dcf879ee-1c1f-4851-9451-6e4c3a13fa47',
				userAccessLevel: 'EXTERNAL',
				mode: 'DOMAIN',
				roleAri: 'ari:cloud:confluence::role/product/member',
				url: 'https://test.jira-dev.com/wiki/spaces/PGT/pages/2691526317/Spike+Team+Product+Access+-+Teams+Page',
				displayName: 'Join Confluence immediately',
				avatarUrl:
					'https://site-admin-avatar-cdn.staging.public.atl-paas.net/avatars/240/trophy.png',
			},
		],
	},
};
