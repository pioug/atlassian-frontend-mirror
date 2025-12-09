import { toTeamARI, toUserId } from '../../common/utils/ari';
import {
	type MembershipState,
	type TeamAgentAssociation,
	type TeamMembership,
	type TeamWithMemberships,
} from '../../types';
import { type ClientConfig } from '../base-client';
import { DEFAULT_CONFIG } from '../constants';
import { BaseGraphQlClient } from '../graphql-client';
import { logException } from '../sentry/main';

import { type AGGPageInfoVariables, type ResultWithPageInfo } from './types';
import {
	UnlinkContainerMutation,
	type UnlinkContainerMutationResponse,
	type UnlinkContainerMutationVariables,
} from './utils/mutations/unlink-container-mutation';
import {
	NumberOfTeamConnectedToContainerQuery,
	type NumberOfTeamConnectedToContainerQueryResponse,
	type NumberOfTeamConnectedToContainerQueryVariables,
} from './utils/queries/number-of-team-connected-to-container-query';
import {
	TeamConnectedToContainerQuery,
	type TeamConnectedToContainerQueryResponse,
	type TeamConnectedToContainerQueryVariables,
} from './utils/queries/team-connected-to-container-query';
import {
	TeamContainersQueryV2,
	type TeamContainersQueryV2Response,
	type TeamContainersQueryV2Variables,
} from './utils/queries/team-containers-query';
import {
	TeamHasAgentsQuery,
	type TeamHasAgentsQueryResponse,
	type TeamHasAgentsQueryVariable,
} from './utils/queries/team-has-agents-query';
import TeamMembershipsQuery, {
	type TeamMembershipQueryResponse,
	type TeamMembershipQueryVariables,
} from './utils/queries/team-membership-query';
import {
	TeamsUserQuery,
	type TeamsUserQueryResponse,
	type TeamsUserQueryVariables,
} from './utils/queries/user-query';
import { toUserType } from './utils/user-type';

// Local type definition to avoid circular dependency with teams-public
type ContainerTypes = 'ConfluenceSpace' | 'JiraProject' | 'LoomSpace' | 'WebLink';
type ContainerSubTypes = string;

type TeamContainer = {
	id: string;
	type: ContainerTypes;
	name: string;
	icon?: string | null;
	createdDate?: Date;
	link?: string | null;
	containerTypeProperties?: {
		subType?: ContainerSubTypes;
		name?: string;
	};
};

export type TeamContainers = Array<TeamContainer>;

export class AGGClient extends BaseGraphQlClient {
	constructor(baseUrl: string, config: ClientConfig) {
		super(`${baseUrl}/graphql`, config);
	}
	setBaseUrl(baseUrl: string) {
		this.setServiceUrl(`${baseUrl}/graphql`);
	}

	async queryTeamMemberships(
		teamId: string,
		membershipState: MembershipState[] = ['FULL_MEMBER'],
		pageInfo: AGGPageInfoVariables = { first: 100 },
	): Promise<ResultWithPageInfo<TeamMembership>> {
		const response = await this.makeGraphQLRequest<
			'team',
			TeamMembershipQueryResponse,
			TeamMembershipQueryVariables
		>(
			{
				query: TeamMembershipsQuery,
				variables: {
					teamId,
					membershipState,
					siteId: this.getCloudId(),
					...pageInfo,
				},
			},
			{
				operationName: 'TeamMembership',
			},
		);
		return {
			edges: response.team.teamV2.members.edges.map<TeamMembership>(({ node }) => ({
				membershipId: {
					teamId,
					memberId: toUserId(node.member.id),
				},
				state: node.state,
				role: node.role,
				user: {
					id: toUserId(node.member.id),
					fullName: node.member.name,
					avatarUrl: node.member.picture,
					status: node.member.accountStatus,
					title: node.member.extendedProfile?.jobTitle ?? undefined,
					userType: toUserType({ appType: node.member.appType }),
				},
			})),
			pageInfo: response.team.teamV2.members.pageInfo,
		};
	}

	async queryAGGUser(userId: string): Promise<TeamsUserQueryResponse> {
		const response = await this.makeGraphQLRequest<
			'user',
			TeamsUserQueryResponse,
			TeamsUserQueryVariables
		>(
			{
				query: TeamsUserQuery,
				variables: {
					userId,
				},
			},
			{
				operationName: 'TeamsUserQuery',
			},
		);
		return response.user;
	}

	async queryTeamHasAgents(teamId: string): Promise<TeamAgentAssociation[]> {
		const teamAri = toTeamARI(teamId);

		const response = await this.makeGraphQLRequest<
			'graphStore',
			TeamHasAgentsQueryResponse,
			TeamHasAgentsQueryVariable
		>(
			{
				query: TeamHasAgentsQuery,
				variables: {
					id: teamAri,
				},
			},
			{
				operationName: 'TeamHasAgentsQuery',
			},
		);

		return this.processTeamHasAgentsResponse(teamId, response.graphStore);
	}

	private processTeamHasAgentsResponse(
		teamId: string,
		response: TeamHasAgentsQueryResponse,
	): TeamAgentAssociation[] {
		return response.teamHasAgents.edges.map(({ node }) => ({
			associationId: {
				teamId,
				accountId: toUserId(node.id),
			},
			agent: {
				id: node.id,
				fullName: node.name,
				avatarUrl: node.picture,
			},
		}));
	}

	async getTeamContainers(teamId: string) {
		const teamAri = toTeamARI(teamId);
		const cypherQuery = `MATCH (team:IdentityTeam {ari: '${teamAri}'})-[:team_connected_to_container]->(container) RETURN container`;

		const response = await this.makeGraphQLRequest<
			'graphStore',
			TeamContainersQueryV2Response,
			TeamContainersQueryV2Variables
		>(
			{
				query: TeamContainersQueryV2,
				variables: {
					cypherQuery,
					params: {
						id: teamAri,
					},
				},
			},
			{
				operationName: 'TeamContainersQueryV2',
			},
		);

		return this.processV2Response(response);
	}

	private processV2Response(response: { graphStore: TeamContainersQueryV2Response }) {
		const containersResult = response.graphStore.cypherQueryV2.edges.reduce<TeamContainers>(
			(containers, edge) => {
				edge.node.columns.forEach((column) => {
					const containerData = column.value?.data;

					if (!containerData) {
						return;
					}

					if (containerData?.__typename === 'ConfluenceSpace') {
						containers.push({
							id: containerData.id,
							type: containerData.__typename,
							name: containerData.confluenceSpaceName || '',
							icon: `${containerData.links.base}${containerData.icon.path}`,
							createdDate: new Date(containerData.createdDate),
							link: `${containerData.links.base}${containerData.links.webUi}`,
							containerTypeProperties: {
								subType: undefined,
								name: undefined,
							},
						});
					} else if (containerData?.__typename === 'JiraProject') {
						containers.push({
							id: containerData.id,
							type: containerData.__typename,
							name: containerData.jiraProjectName,
							icon: containerData.avatar.medium,
							createdDate: new Date(containerData.created),
							link: containerData.webUrl,
							containerTypeProperties: {
								subType: containerData.projectType || '',
								name: containerData.projectTypeName || '',
							},
						});
					} else if (containerData?.__typename === 'LoomSpace') {
						containers.push({
							id: containerData.id,
							type: containerData.__typename,
							name: containerData.loomSpaceName,
							icon: '',
							link: containerData.url,
						});
					}
				});
				return containers;
			},
			[],
		);

		return containersResult;
	}

	async unlinkTeamContainer(teamId: string, containerId: string) {
		const teamAri = toTeamARI(teamId);

		const response = await this.makeGraphQLRequest<
			'graphStore',
			UnlinkContainerMutationResponse,
			UnlinkContainerMutationVariables
		>(
			{
				query: UnlinkContainerMutation,
				variables: {
					containerId,
					teamId: teamAri,
				},
			},
			{
				operationName: 'UnlinkContainerMutation',
			},
		);

		return response.graphStore;
	}

	async queryNumberOfTeamConnectedToContainer(containerId: string): Promise<number> {
		const response = await this.makeGraphQLRequest<
			'graphStore',
			NumberOfTeamConnectedToContainerQueryResponse,
			NumberOfTeamConnectedToContainerQueryVariables
		>(
			{
				query: NumberOfTeamConnectedToContainerQuery,
				variables: {
					containerId,
				},
			},
			{
				operationName: 'NumberOfTeamConnectedToContainerQuery',
			},
		);
		return response?.graphStore?.teamConnectedToContainerInverse?.edges?.length;
	}

	async queryTeamsConnectedToContainer(containerId: string): Promise<TeamWithMemberships[]> {
		const response = await this.makeGraphQLRequest<
			'graphStore',
			TeamConnectedToContainerQueryResponse,
			TeamConnectedToContainerQueryVariables
		>(
			{
				query: TeamConnectedToContainerQuery,
				variables: {
					containerId,
				},
			},
			{
				operationName: 'TeamConnectedToContainerQuery',
			},
		);
		return response?.graphStore?.teamConnectedToContainerInverse?.edges?.map<TeamWithMemberships>(
			({ node }) => ({
				id: node.id,
				displayName: node.displayName,
				description: node.description,
				state: node.state,
				membershipSettings: node.membershipSettings,
				organizationId: node.organizationId,
				creatorId: node.creator?.id,
				isVerified: node.isVerified,
				members:
					node.members?.nodes.map(({ member }) => ({
						id: member?.id ? toUserId(member?.id) : '',
						fullName: member?.name ?? '',
						avatarUrl: member?.picture,
						status: member?.accountStatus,
					})) ?? [],
				includesYou: false, // to-do - this needs to be computed - https://product-fabric.atlassian.net/browse/CCECO-4368
				memberCount: node.members?.nodes.length ?? 0,
				largeAvatarImageUrl: node.largeAvatarImageUrl,
				smallAvatarImageUrl: node.smallAvatarImageUrl,
				largeHeaderImageUrl: node.largeHeaderImageUrl,
				smallHeaderImageUrl: node.smallHeaderImageUrl,
				restriction: 'ORG_MEMBERS', // deprecated field, kept for backwards compatibility
			}),
		);
	}
}

export const aggClient = new AGGClient(DEFAULT_CONFIG.stargateRoot, {
	logException,
});
