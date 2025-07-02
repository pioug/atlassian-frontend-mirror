import faker from 'faker';

import { teamsClientMocks } from '../../mocks/with-faker';
import {
	type LinkOrder,
	type OrgScope,
	type TeamLink,
	type TeamWithImageUrls,
	type TeamWithMemberships,
} from '../../types';
import { type ExternalReference } from '../../types/team';
import { ContainerType } from '../../types/team-container';
import { RestClient } from '../rest-client';

import {
	type LegionLinkResponseV4,
	type LegionPaginatedResponse,
	type LegionTeamCreateResponseV3,
	type LegionTeamCreateResponseV4,
	type LegionTeamGetResponseV4,
	type LegionTeamSearchResponseV4,
} from './types';

import {
	type AllTeamsQuery,
	type AllTeamsResponse,
	defaultLegionClient,
	LegionClient,
	type OriginQuery,
} from './index';

jest.mock('../rest-client', () => {
	const ActualRestClient = jest.requireActual('../rest-client');
	// ActualRestClient.prototype.postResource = jest.fn();
	// ActualRestClient.prototype.getResource = jest.fn();
	// ActualRestClient.prototype.patchResource = jest.fn();

	return {
		__esModules: true,
		...ActualRestClient,
		postResource: jest.fn(),
		getResource: jest.fn(),
		patchResource: jest.fn(),
	};
});

const legionClient = defaultLegionClient;

const v3UrlPath = `/v3/teams`;
const v4UrlPath = `/v4/teams`;

const mockPostResource = jest
	.spyOn(RestClient.prototype, 'postResource')
	.mockReturnValue(Promise.resolve());
const mockGetResource = jest
	.spyOn(RestClient.prototype, 'getResource')
	.mockReturnValue(Promise.resolve());
const mockGetResourceCached = jest
	.spyOn(RestClient.prototype, 'getResourceCached')
	.mockReturnValue(Promise.resolve());
const mockPatchResource = jest
	.spyOn(RestClient.prototype, 'patchResource')
	.mockReturnValue(Promise.resolve());
const mockPutResource = jest
	.spyOn(RestClient.prototype, 'putResource')
	.mockReturnValue(Promise.resolve());
const mockDeleteResource = jest
	.spyOn(RestClient.prototype, 'deleteResource')
	.mockReturnValue(Promise.resolve());

const cloudId = faker.random.uuid();
const orgId = faker.random.uuid();

// initialize mock constructors
const { randomFullTeam, randomTeamLinks, randomTeamWithMemberships } = teamsClientMocks({ faker });

const sampleTeam: TeamWithImageUrls = randomFullTeam({
	orgId,
	organizationId: orgId,
});

const sampleTeamWIthMemberships = randomTeamWithMemberships(sampleTeam);

const sampleCreatedTeam: TeamWithImageUrls = {
	id: sampleTeam.id,
	displayName: sampleTeam.displayName,
	description: sampleTeam.description,
	state: sampleTeam.state,
	membershipSettings: sampleTeam.membershipSettings,
	organizationId: sampleTeam.organizationId,
	restriction: sampleTeam.restriction,
	creatorId: sampleTeam.creatorId,
	creatorDomain: sampleTeam.creatorDomain,
	permission: sampleTeam.permission,
	orgId: sampleTeam.orgId,
	memberIds: sampleTeam.memberIds,
	membership: sampleTeam.membership,
	smallHeaderImageUrl: sampleTeam.smallHeaderImageUrl,
	largeHeaderImageUrl: sampleTeam.largeHeaderImageUrl,
	smallAvatarImageUrl: sampleTeam.smallAvatarImageUrl,
	largeAvatarImageUrl: sampleTeam.largeAvatarImageUrl,
};

const sampleTeamWithAri = {
	...sampleTeam,
	id: `ari:cloud:teams::team/${sampleTeam.id}`,
};

const sampleAllTeamsResponse: AllTeamsResponse = {
	teams: [
		{
			id: sampleTeam.id,
			displayName: sampleTeam.displayName,
			description: sampleTeam.description,
			state: sampleTeam.state,
			membershipSettings: sampleTeam.membershipSettings,
			organizationId: sampleTeam.organizationId,
			restriction: sampleTeam.restriction,
			smallHeaderImageUrl: sampleTeam.smallHeaderImageUrl,
			largeHeaderImageUrl: sampleTeam.largeHeaderImageUrl,
			smallAvatarImageUrl: sampleTeam.smallAvatarImageUrl,
			largeAvatarImageUrl: sampleTeam.largeAvatarImageUrl,
			memberIds: [],
			members: [],
			includesYou: sampleTeamWIthMemberships.includesYou,
			memberCount: sampleTeamWIthMemberships.memberCount,
			membership: {
				members: [],
				errors: [],
			},
		} as TeamWithMemberships,
	],
	cursor: faker.random.arrayElement([faker.random.uuid(), '']),
};

const sampleLegionTeamSearchPaginationResponseV4: LegionPaginatedResponse<LegionTeamSearchResponseV4> =
	{
		entities: [
			{
				id: sampleTeam.id,
				displayName: sampleTeam.displayName,
				description: sampleTeam.description,
				state: sampleTeam.state,
				membershipSettings: sampleTeam.membershipSettings,
				organizationId: sampleTeam.organizationId,
				largeHeaderImageUrl: sampleTeam.largeHeaderImageUrl,
				smallAvatarImageUrl: sampleTeam.smallAvatarImageUrl,
				smallHeaderImageUrl: sampleTeam.smallHeaderImageUrl,
				largeAvatarImageUrl: sampleTeam.largeAvatarImageUrl,
				memberCount: sampleTeamWIthMemberships.memberCount,
				includesYou: sampleTeamWIthMemberships.includesYou,
			},
		],
		cursor: sampleAllTeamsResponse.cursor,
	};

const sampleTeamLinksV4: { entities: TeamLink[] } = {
	entities: randomTeamLinks(3, {
		teamId: faker.random.uuid(),
	}),
};

const sampleTeamResponseV4: LegionTeamGetResponseV4 = {
	id: sampleTeam.id,
	displayName: sampleTeam.displayName,
	description: sampleTeam.description,
	state: sampleTeam.state,
	membershipSettings: sampleTeam.membershipSettings,
	organizationId: sampleTeam.organizationId!,
	creatorId: sampleTeam.creatorId,
	permission: sampleTeam.permission,
	largeHeaderImageUrl: sampleTeam.largeHeaderImageUrl!,
	smallHeaderImageUrl: sampleTeam.smallHeaderImageUrl!,
	largeAvatarImageUrl: sampleTeam.largeAvatarImageUrl!,
	smallAvatarImageUrl: sampleTeam.smallAvatarImageUrl!,
	scopeMode: 'ORG_SCOPE_MODE',
};

const sampleTeamCreateResponseV3: LegionTeamCreateResponseV3 = {
	id: sampleTeam.id,
	displayName: sampleTeam.displayName,
	description: sampleTeam.description,
	state: sampleTeam.state,
	membershipSettings: sampleTeam.membershipSettings,
	discoverable: sampleTeam.discoverable,
	organizationId: sampleTeam.organizationId,
	restriction: sampleTeam.restriction,
	creatorId: sampleTeam.creatorId,
	creatorDomain: sampleTeam.creatorDomain,
	permission: sampleTeam.permission,
	membership: {
		members: sampleTeam.membership?.members ?? [],
		errors: sampleTeam.membership?.errors ?? [],
	},
};

const sampleTeamCreateResponseV4: LegionTeamCreateResponseV4 = {
	id: sampleTeam.id,
	displayName: sampleTeam.displayName,
	description: sampleTeam.description,
	state: sampleTeam.state,
	membershipSettings: sampleTeam.membershipSettings,
	organizationId: sampleTeam.organizationId!,
	creatorId: sampleTeam.creatorId,
	permission: sampleTeam.permission,
	membership: {
		members: sampleTeam.membership?.members ?? [],
		errors: sampleTeam.membership?.errors ?? [],
	},
	scopeMode: 'ORG_SCOPE_MODE',
};

const sampleLegionLinkResponseV4: LegionPaginatedResponse<LegionLinkResponseV4> = {
	...sampleTeamLinksV4,
	cursor: faker.random.arrayElement([faker.random.uuid(), '']),
};

const sampleTeamLink: TeamLink = randomTeamLinks(1, {
	teamId: faker.random.uuid(),
	creationTime: faker.date.past().toString(),
})[0];

const sampleTeamLinkResponseV4: LegionLinkResponseV4 = {
	linkId: sampleTeamLink.linkId,
	teamId: sampleTeamLink.teamId,
	contentTitle: sampleTeamLink.contentTitle,
	description: sampleTeamLink.description,
	linkUri: sampleTeamLink.linkUri,
};

const sampleLinkOrder: LinkOrder = {
	teamId: sampleTeamLink.teamId!,
	linkOrder: [sampleTeamLink.linkId],
};

describe('legion-client', () => {
	beforeEach(() => {
		legionClient.setContext({ cloudId, orgId });
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('invite team member', () => {
		const testTeamId = sampleTeam.id;
		const selectedUsers = [
			{
				id: null,
				email: 'newEmail@example.com',
			},
			{
				id: 'hiddenUser',
				email: null,
			},
			{
				id: 'normalUser',
				email: 'normalUser@example.com',
			},
		];

		it('should split user objects into emails and aaIds', async () => {
			const originQuery: OriginQuery = {
				cloudId,
				product: 'Confluence',
			};

			// action
			await legionClient.inviteUsersToTeam(testTeamId, selectedUsers, originQuery);

			// assert
			const expectCloudIdQuery = `origin.cloudId=${cloudId}`;
			const expectProductQuery = 'origin.product=CONFLUENCE';
			expect(mockPostResource).toHaveBeenCalledWith(
				`${v3UrlPath}/ui/${testTeamId}/membership/invite?${expectCloudIdQuery}&${expectProductQuery}`,
				{
					emailAddresses: ['newEmail@example.com'],
					atlassianAccounts: ['hiddenUser', 'normalUser'],
				},
			);
		});

		it('should not send origin.product query if it is not defined ', async () => {
			// mock
			const originQuery: OriginQuery = {
				cloudId: cloudId,
			};
			mockPostResource.mockReturnValue(Promise.resolve());

			// action
			await legionClient.inviteUsersToTeam(testTeamId, selectedUsers, originQuery);

			// assert
			const expectCloudIdQuery = `origin.cloudId=${cloudId}`;
			expect(mockPostResource).toHaveBeenCalledWith(
				`${v3UrlPath}/ui/${testTeamId}/membership/invite?${expectCloudIdQuery}`,
				{
					emailAddresses: ['newEmail@example.com'],
					atlassianAccounts: ['hiddenUser', 'normalUser'],
				},
			);
		});

		it('should encode query string', async () => {
			// mock
			mockPostResource.mockReturnValue(Promise.resolve());
			const originQuery: OriginQuery = {
				cloudId: 'test-<cloud>-"id"',
				product: 'Confluence<script>',
			};

			// action
			await legionClient.inviteUsersToTeam(testTeamId, selectedUsers, originQuery);

			// assert
			const expectCloudIdQuery = 'origin.cloudId=test-%3Ccloud%3E-%22id%22';
			const expectProductQuery = 'origin.product=CONFLUENCE%3CSCRIPT%3E';

			expect(mockPostResource).toHaveBeenCalledWith(
				`${v3UrlPath}/ui/${testTeamId}/membership/invite?${expectCloudIdQuery}&${expectProductQuery}`,
				{
					emailAddresses: ['newEmail@example.com'],
					atlassianAccounts: ['hiddenUser', 'normalUser'],
				},
			);
		});
	});

	describe('create team', () => {
		const testTeamName = sampleTeam.displayName;
		const originQuery: OriginQuery = {
			cloudId,
			product: 'Confluence',
		};

		const expectCloudIdQuery = `origin.cloudId=${cloudId}`;
		const expectProductQuery = 'origin.product=CONFLUENCE';

		it('should create team with correct options', async () => {
			mockPostResource.mockReturnValue(Promise.resolve(sampleTeamCreateResponseV4));

			const {
				creatorDomain,
				smallAvatarImageUrl,
				smallHeaderImageUrl,
				largeAvatarImageUrl,
				largeHeaderImageUrl,
				...expectedTeam
			} = sampleCreatedTeam;

			// action
			const team = await legionClient.createTeam(testTeamName, originQuery);

			// assert
			expect(mockPostResource).toHaveBeenCalledWith(
				`${v4UrlPath}?${expectCloudIdQuery}&${expectProductQuery}`,
				{
					displayName: testTeamName,
					description: '',
					membershipSettings: 'OPEN',
					siteId: cloudId,
					organizationId: orgId,
					members: [],
				},
			);
			// Deprecated field, override to default value
			expectedTeam.restriction = 'ORG_MEMBERS';
			expect(team).toEqual({ ...expectedTeam });
		});

		it('should not send origin.product query if it is not defined ', async () => {
			// mock
			mockPostResource.mockReturnValue(Promise.resolve(sampleTeamCreateResponseV3));

			const originQuery: OriginQuery = {
				cloudId: 'test-cloud-id',
			};

			// action
			await legionClient.createTeam(testTeamName, originQuery);

			// assert
			const expectCloudIdQuery = 'origin.cloudId=test-cloud-id';
			expect(mockPostResource).toHaveBeenCalledWith(`${v4UrlPath}?${expectCloudIdQuery}`, {
				displayName: testTeamName,
				description: '',
				membershipSettings: 'OPEN',
				members: [],
				organizationId: orgId,
				siteId: cloudId,
			});
		});
	});

	describe('create external team', () => {
		const testTeamDescription = sampleTeam.description;
		const testTeamName = sampleTeam.displayName;
		const externalReference: ExternalReference = {
			source: 'ATLASSIAN_GROUP',
			id: 'test-group-id',
		};
		const organizationId = sampleTeam.organizationId;
		beforeEach(() => {
			legionClient.setContext({ cloudId: 'None', orgId: organizationId });
		});

		it('should create external team with correct options', async () => {
			// mock
			const externalTeamCreateResponse: LegionTeamCreateResponseV4 = {
				...sampleTeamCreateResponseV4,
				membershipSettings: 'EXTERNAL',
			};
			mockPostResource.mockReturnValue(Promise.resolve(externalTeamCreateResponse));

			const {
				creatorDomain,
				smallAvatarImageUrl,
				smallHeaderImageUrl,
				largeAvatarImageUrl,
				largeHeaderImageUrl,
				...expectedTeam
			} = sampleCreatedTeam;

			// action
			const externalTeam = await legionClient.createExternalTeam(
				testTeamDescription,
				externalReference,
				testTeamName,
			);

			// assert
			expect(mockPostResource).toHaveBeenCalledWith(`${v4UrlPath}/external?origin.cloudId=None`, {
				description: testTeamDescription,
				externalReference,
				organizationId,
				siteId: 'None',
				displayName: testTeamName,
			});
			// Deprecated field, override to default value
			expectedTeam.restriction = 'ORG_MEMBERS';
			expect(externalTeam).toEqual({ ...expectedTeam, membershipSettings: 'EXTERNAL' });
		});

		it('should use passed in site id instead of context one if provided', async () => {
			// mock
			const externalTeamCreateResponse: LegionTeamCreateResponseV4 = {
				...sampleTeamCreateResponseV4,
				membershipSettings: 'EXTERNAL',
			};
			mockPostResource.mockReturnValue(Promise.resolve(externalTeamCreateResponse));

			// action
			await legionClient.createExternalTeam(
				testTeamDescription,
				externalReference,
				testTeamName,
				'new-site-id',
			);

			// assert
			expect(mockPostResource).toHaveBeenCalledWith(
				`${v4UrlPath}/external?origin.cloudId=new-site-id`,
				{
					description: testTeamDescription,
					externalReference,
					organizationId,
					siteId: 'new-site-id',
					displayName: testTeamName,
				},
			);
		});
	});

	describe('getTeamById', () => {
		it('should return team from team response', async () => {
			mockGetResource.mockReturnValue(Promise.resolve(sampleTeamResponseV4));

			const { creatorDomain, ...expectedTeam } = sampleTeam;

			// action
			const team = await legionClient.getTeamById(expectedTeam.id);

			// assert
			expect(mockGetResource).toHaveBeenCalledWith(
				`${v4UrlPath}/${expectedTeam.id}?siteId=${cloudId}`,
			);
			const { memberIds, membership, ...expectedFetchedTeam } = expectedTeam;
			// Deprecated field, override to default value
			expectedFetchedTeam.restriction = 'ORG_MEMBERS';
			expectedFetchedTeam.scopeMode = 'ORG_SCOPE_MODE';
			expect(team).toEqual(expectedFetchedTeam);
		});
	});

	describe('getAllTeams', () => {
		it('should return team from team response', async () => {
			mockPostResource.mockReturnValue(Promise.resolve(sampleLegionTeamSearchPaginationResponseV4));

			const expectedResponse = { ...sampleAllTeamsResponse };

			const query: AllTeamsQuery = {
				orgId: orgId,
				limit: 10,
				showEmptyTeams: true,
			};

			// action
			const response = await legionClient.getAllTeams(query);

			// assert
			expect(mockPostResource).toHaveBeenCalledWith(`${v4UrlPath}/search`, {
				organizationId: orgId,
				siteId: cloudId,
				limit: query.limit,
				query: query.searchQuery,
				showEmptyTeams: true,
				cursor: query.cursor || '',
				sortBy: query.useDefaultSort
					? null
					: [
							{
								field: 'displayName',
								order: 'asc',
							},
						],
				membership: { memberAccountIds: query.memberAccountIds },
			});

			// Deprecated field, override to default value
			expectedResponse.teams = expectedResponse.teams.map((team) => ({
				...team,
				restriction: 'ORG_MEMBERS',
			}));

			expect(response).toEqual(expectedResponse);
		});
	});

	describe('updateTeamById', () => {
		it('should update team and return team from team response', async () => {
			const newTeam = {
				...sampleTeam,
				displayName: 'new team 2',
				description: 'new description',
				scopeMode: 'ORG_SCOPE_MODE',
			};

			const responseMock = {
				...sampleTeamResponseV4,
				displayName: 'new team 2',
				description: 'new description',
			};
			const { creatorDomain, ...expectedTeam } = newTeam;

			mockPatchResource.mockReturnValue(Promise.resolve(responseMock));

			// action
			const team = await legionClient.updateTeamById(
				expectedTeam.id,
				// @ts-ignore
				newTeam,
			);

			// Deprecated field, override to default value
			if (expectedTeam.restriction) {
				expectedTeam.restriction = 'ORG_MEMBERS';
			}

			// assert
			expect(mockPatchResource).toHaveBeenCalledWith(`${v4UrlPath}/${newTeam.id}`, newTeam);

			const { memberIds, membership, ...expectedUpdatedTeam } = expectedTeam;

			expect(team).toEqual(expectedUpdatedTeam);
		});
	});

	describe('createTeamLink', () => {
		// FIXME: Jest upgrade
		// TypeError: Cannot read properties of undefined (reading 'contentTitle')
		it.skip('should trim all input fields', () => {
			const teamId = sampleTeamWithAri.id;

			const teamLink = {
				contentTitle: '     string     ',
				description: '     string     ',
				linkUri: '     string     ',
				creationTime: '     string     ',
			};

			// action
			legionClient.createTeamLink(teamId, teamLink);

			// assert
			expect(mockPostResource).toHaveBeenCalledWith(`${v4UrlPath}/${sampleTeam.id}/links`, {
				contentTitle: 'string',
				description: 'string',
				linkUri: 'string',
				creationTime: 'string',
			});
		});

		it('should create team link', async () => {
			mockPostResource.mockReturnValue(Promise.resolve(sampleTeamLinkResponseV4));

			const expectedTeamLink = { ...sampleTeamLink };
			delete expectedTeamLink.creationTime;

			// action
			const createdLink = await legionClient.createTeamLink(sampleTeamLink.teamId!, sampleTeamLink);

			// assert
			expect(mockPostResource).toHaveBeenCalledWith(`${v4UrlPath}/${sampleTeamLink.teamId}/links`, {
				contentTitle: sampleTeamLink.contentTitle,
				linkUri: sampleTeamLink.linkUri,
				description: sampleTeamLink.description,
				creationTime: sampleTeamLink.creationTime,
				teamId: sampleTeamLink.teamId,
			});
			expect(createdLink).toEqual(expectedTeamLink);
		});
	});

	describe('updateTeamLink', () => {
		it('should update team link', async () => {
			mockPutResource.mockReturnValue(Promise.resolve(sampleTeamLinkResponseV4));

			const expectedTeamLink = { ...sampleTeamLink };
			delete expectedTeamLink.creationTime;

			// action
			const result = await legionClient.updateTeamLink(
				sampleTeamLink.teamId!,
				sampleTeamLink.linkId!,
				sampleTeamLink,
			);

			// assert
			expect(mockPutResource).toHaveBeenCalledWith(
				`${v4UrlPath}/${sampleTeamLink.teamId}/links/${sampleTeamLink.linkId}`,
				{
					contentTitle: sampleTeamLink.contentTitle,
					creationTime: sampleTeamLink.creationTime,
					description: sampleTeamLink.description,
					linkId: sampleTeamLink.linkId,
					linkUri: sampleTeamLink.linkUri,
					teamId: sampleTeamLink.teamId,
				},
			);

			expect(result).toEqual(expectedTeamLink);
		});
	});

	describe('deleteTeamLink', () => {
		it('should delete team link', async () => {
			mockDeleteResource.mockReturnValue(Promise.resolve());

			// action
			await legionClient.deleteTeamLink(sampleTeamLink.teamId!, sampleTeamLink.linkId!);

			// assert
			expect(mockDeleteResource).toHaveBeenCalledWith(
				`${v4UrlPath}/${sampleTeamLink.teamId}/links/${sampleTeamLink.linkId}`,
			);
		});
	});

	describe('reorderTeamLink', () => {
		it('should reorder team link', async () => {
			const linkOrderResponse = { ...sampleLinkOrder };

			mockPostResource.mockReturnValue(Promise.resolve(linkOrderResponse));

			const expectedResult = { ...sampleLinkOrder };

			// action
			const response = await legionClient.reorderTeamLink(
				sampleTeamLink.teamId!,
				sampleTeamLink.linkId!,
				0,
			);

			// assert
			expect(mockPostResource).toHaveBeenCalledWith(
				`${v4UrlPath}/${sampleTeamLink.teamId}/links/order?linkId=${expectedResult.linkOrder[0]}&newPosition=0`,
			);
			expect(response).toEqual(expectedResult);
		});
	});

	describe('getTeamLinksByTeamId', () => {
		it('get team links by team id', async () => {
			mockGetResource.mockReturnValue(Promise.resolve(sampleLegionLinkResponseV4));

			// action
			const result = await legionClient.getTeamLinksByTeamId(sampleTeam.id);

			// assert
			expect(mockGetResource).toHaveBeenCalledWith(
				`${v4UrlPath}/${sampleTeam.id}/links?siteId=${cloudId}`,
			);

			expect(result).toEqual(sampleTeamLinksV4);
		});
	});

	describe('teamAriTrimming', () => {
		const newTeamAri = 'ari:cloud:identity::team/someTeamIdWithNewAri';
		const oldTeamAri = 'ari:cloud:teams::team/someTeamId';

		it('should trim old ARI', () => {
			const teamId = legionClient.trimTeamARI(oldTeamAri);
			expect(teamId).toEqual('someTeamId');
		});

		it('should trim new ARI', () => {
			const teamId = legionClient.trimTeamARI(newTeamAri);
			expect(teamId).toEqual('someTeamIdWithNewAri');
		});

		it('should not change the id if not an ARI', () => {
			const teamId = legionClient.trimTeamARI('someTeamId');
			expect(teamId).toEqual('someTeamId');
		});
	});

	describe('v4 Client initialisation', () => {
		it('should query use the correct URL', () => {
			const client = new LegionClient('/v4/teams');
			expect(client.serviceUrl).toContain('/v4/teams');
		});
	});

	describe('update root URL', () => {
		it('should update URL when it is changed', () => {
			const client = new LegionClient('/v4/teams');
			expect(client.serviceUrl).toBe('/v4/teams');
			client.setRootUrl('newRoot');
			expect(client.serviceUrl).toBe('newRoot');
		});
	});

	describe('declineJoinRequest', () => {
		const testTeamId = sampleTeam.id;
		const testMemberId = 'someAccountId';

		it('should decline join request', async () => {
			mockPostResource.mockReturnValue(Promise.resolve());

			await legionClient.declineJoinRequest(testTeamId, testMemberId);

			expect(mockPostResource).toHaveBeenCalledWith(
				`${v4UrlPath}/${testTeamId}/membership/${testMemberId}/request/decline`,
			);
		});
	});

	describe('getUserInSiteUserBase', () => {
		const testUserId = 'someAccountId';

		it('should get user in site user base', async () => {
			mockGetResource.mockReturnValue(Promise.resolve({ isPromise: true }));

			await legionClient.getUserInSiteUserBase(testUserId);

			expect(mockGetResource).toHaveBeenCalledWith(
				`/teams/site/${cloudId}/users/${testUserId}/exists`,
				{
					headers: {
						Accept: 'application/json',
						'X-header-client-id': 'ptc-fe',
					},
				},
			);
		});
	});

	describe('getOrgScope', () => {
		it('should not fetch and throw error if no orgId set in context', () => {
			legionClient.setContext({});
			expect(() => legionClient.getOrgScope()).rejects.toThrowError();
			expect(mockGetResourceCached).not.toHaveBeenCalled();
		});

		it('should fetch org scope', async () => {
			const mockResponse: OrgScope = {
				scopeMode: 'ORG_SCOPE_MODE',
				scopes: [
					{
						id: 'someScopeId',
						name: 'org name',
					},
				],
			};
			mockGetResourceCached.mockReturnValue(Promise.resolve(mockResponse));

			const response = await legionClient.getOrgScope();

			expect(mockGetResourceCached).toHaveBeenCalledWith(`/v4/teams/org/${orgId}/scope`);
			expect(response).toEqual(mockResponse);
		});
	});

	describe('restoreTeamToSyncedGroup', () => {
		const testTeamId = sampleTeam.id;
		const testExternalReference: ExternalReference = {
			source: 'ATLASSIAN_GROUP',
			id: 'test-group-id',
		};

		it('should restore team and link to group', async () => {
			mockPostResource.mockReturnValue(Promise.resolve());

			await legionClient.restoreTeamToSyncedGroup(testTeamId, testExternalReference);

			expect(mockPostResource).toHaveBeenCalledWith(`/v4/teams/${testTeamId}/external/restore`, {
				externalReference: testExternalReference,
				siteId: cloudId,
			});
		});
	});

	describe('getTeamAndGroupDiff', () => {
		const testTeamId = sampleTeam.id;
		const testExternalReference: ExternalReference = {
			source: 'ATLASSIAN_GROUP',
			id: 'test-group-id',
		};

		it('should get team and group difference', async () => {
			const mockResponse = {
				displayNameChange: {
					from: 'oldName',
					to: 'newName',
				},
				membersToAdd: {
					count: 1,
					memberIds: ['memberId-1'],
				},
				membersToRemove: {
					count: 1,
					memberIds: ['memberId-2'],
				},
			};
			mockPostResource.mockReturnValue(Promise.resolve(mockResponse));

			const response = await legionClient.getTeamAndGroupDiff(testTeamId, testExternalReference);

			expect(mockPostResource).toHaveBeenCalledWith(`/v4/teams/${testTeamId}/external/diff`, {
				siteId: cloudId,
				externalReference: testExternalReference,
			});
			expect(response).toEqual(mockResponse);
		});
	});

	describe('linkExistingTeamToGroup', () => {
		const testTeamId = sampleTeam.id;
		const testExternalReference: ExternalReference = {
			source: 'ATLASSIAN_GROUP',
			id: 'test-group-id',
		};

		it('should link an existing team to a group', async () => {
			mockPostResource.mockReturnValue(Promise.resolve());

			await legionClient.linkExistingTeamToGroup(testTeamId, testExternalReference);

			expect(mockPostResource).toHaveBeenCalledWith(`/v4/teams/${testTeamId}/external/link`, {
				externalReference: testExternalReference,
				siteId: cloudId,
			});
		});
	});

	describe('getOrgEligibilityForManagedTeams', () => {
		it('should get org eligibility for managed teams', async () => {
			const mockResponse = {
				eligible: true,
			};
			mockGetResourceCached.mockReturnValue(Promise.resolve(mockResponse));

			const response = await legionClient.getOrgEligibilityForManagedTeams();

			expect(mockGetResourceCached).toHaveBeenCalledWith(
				`/v4/teams/org/${orgId}/premium/eligibility`,
			);
			expect(response).toEqual(mockResponse);
		});
	});

	describe('createTeamContainers', () => {
		const teamId = 'test-team-id';
		const containerSiteId = 'test-site-id';
		type Payload = Parameters<typeof legionClient.createTeamContainers>[0];
		type Response = Awaited<ReturnType<typeof legionClient.createTeamContainers>>;

		it('should create team containers with correct payload', async () => {
			const mockPayload: Payload = {
				teamId,
				containers: [{ type: ContainerType.CONFLUENCE_SPACE, containerSiteId }],
			};

			const mockResponse: Response = {
				teamId,
				containersNotCreated: [],
				containersCreated: [
					{
						containerId: 'test-container-id',
						containerName: 'test-container',
						containerUrl: 'https://test.com',
						containerSiteId: 'test-site-id',
						containerType: ContainerType.CONFLUENCE_SPACE,
					},
				],
			};

			mockPostResource.mockReturnValue(Promise.resolve(mockResponse));
			const result = await legionClient.createTeamContainers(mockPayload);
			expect(mockPostResource).toHaveBeenCalledWith(`${v4UrlPath}/containers`, mockPayload);
			expect(result).toEqual(mockResponse);
		});

		it('should handle containers not created', async () => {
			const mockPayload: Payload = {
				teamId,
				containers: [{ type: ContainerType.CONFLUENCE_SPACE, containerSiteId: 'test-site-id' }],
			};

			const mockResponse: Response = {
				teamId,
				containersNotCreated: [
					{ containerType: ContainerType.CONFLUENCE_SPACE, reason: 'Duplicate container found' },
				],
				containersCreated: [],
			};
			mockPostResource.mockReturnValue(Promise.resolve(mockResponse));
			const result = await legionClient.createTeamContainers(mockPayload);
			expect(mockPostResource).toHaveBeenCalledWith(`${v4UrlPath}/containers`, mockPayload);
			expect(result).toEqual(mockResponse);
		});

		it('can handle multiple containers', async () => {
			const mockPayload: Payload = {
				teamId,
				containers: [
					{ type: ContainerType.CONFLUENCE_SPACE, containerSiteId },
					{ type: ContainerType.JIRA_PROJECT, containerSiteId },
					{ type: ContainerType.LOOM_SPACE, containerSiteId },
				],
			};
			const mockResponse: Response = {
				teamId,
				containersNotCreated: [],
				containersCreated: [
					{
						containerId: 'test-container-id-1',
						containerName: 'container-1',
						containerUrl: 'https://test.com',
						containerSiteId,
						containerType: ContainerType.CONFLUENCE_SPACE,
					},
					{
						containerId: 'test-container-id-2',
						containerName: 'container-2',
						containerUrl: 'https://test.com',
						containerSiteId,
						containerType: ContainerType.JIRA_PROJECT,
					},
					{
						containerId: 'test-container-id-3',
						containerName: 'container-3',
						containerUrl: 'https://test.com',
						containerSiteId,
						containerType: ContainerType.LOOM_SPACE,
					},
				],
			};

			mockPostResource.mockReturnValue(Promise.resolve(mockResponse));
			const result = await legionClient.createTeamContainers(mockPayload);
			expect(mockPostResource).toHaveBeenCalledWith(`${v4UrlPath}/containers`, mockPayload);
			expect(result).toEqual(mockResponse);
		});
	});
});
