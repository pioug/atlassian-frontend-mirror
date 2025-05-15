import { teamIdToAri } from '../../common/utils/team-id-to-ari';
import { toUserId } from '../../common/utils/user-ari';
import { type ClientConfig } from '../base-client';
import { DEFAULT_CONFIG } from '../constants';
import { BaseGraphQlClient } from '../graphql-client';
import type { TeamMember, TeamWithMemberships } from '../types';

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
	TeamContainersQuery,
	type TeamContainersQueryResponse,
	type TeamContainersQueryVariables,
} from './utils/queries/team-containers-query';

export class AGGClient extends BaseGraphQlClient {
	constructor(baseUrl: string, config: ClientConfig) {
		super(`${baseUrl}/graphql`, config);
	}
	setBaseUrl(baseUrl: string) {
		this.setServiceUrl(`${baseUrl}/graphql`);
	}

	async getTeamContainers(teamId: string) {
		const teamAri = teamIdToAri(teamId);
		const cypherQuery = `MATCH (team:IdentityTeam {ari: '${teamAri}'})-[:team_connected_to_container]->(container) RETURN container`;
		const response = await this.makeGraphQLRequest<
			'graphStore',
			TeamContainersQueryResponse,
			TeamContainersQueryVariables
		>(
			{
				query: TeamContainersQuery,
				variables: {
					cypherQuery,
				},
			},
			{
				operationName: 'TeamContainersQuery',
			},
		);

		const containersResult = response.graphStore.cypherQuery.edges.map((edge) => ({
			id: edge.node.to.id,
			type: edge.node.to.data.__typename,
			name:
				edge.node.to.data.__typename === 'ConfluenceSpace'
					? edge.node.to.data.confluenceSpaceName || ''
					: edge.node.to.data.jiraProjectName,
			icon:
				edge.node.to.data.__typename === 'ConfluenceSpace'
					? `${edge.node.to.data.links.base}${edge.node.to.data.icon.path}`
					: edge.node.to.data.avatar.medium,
			createdDate:
				edge.node.to.data.__typename === 'ConfluenceSpace'
					? new Date(edge.node.to.data.createdDate)
					: new Date(edge.node.to.data.created),
			link:
				edge.node.to.data.__typename === 'ConfluenceSpace'
					? `${edge.node.to.data.links.base}${edge.node.to.data.links.webUi}`
					: edge.node.to.data.webUrl,
			containerTypeProperties: {
				subType:
					edge.node.to.data.__typename === 'JiraProject'
						? edge.node.to.data.projectType || ''
						: undefined,
				name:
					edge.node.to.data.__typename === 'JiraProject'
						? edge.node.to.data.projectTypeName || ''
						: undefined,
			},
		}));

		return containersResult;
	}

	async unlinkTeamContainer(teamId: string, containerId: string) {
		const teamAri = teamIdToAri(teamId);

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
					node.members?.nodes.map<TeamMember>(({ member }) => ({
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
				restriction: 'ORG_MEMBERS', // to-do - figure out if this should be optional (it's deprecated) - https://product-fabric.atlassian.net/browse/CCECO-4368
			}),
		);
	}
}

export const aggClient = new AGGClient(DEFAULT_CONFIG.stargateRoot, {
	logException: () => {},
});
