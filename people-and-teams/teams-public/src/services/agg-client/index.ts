import { teamIdToAri } from '../../common/utils/team-id-to-ari';
import { type ClientConfig } from '../base-client';
import { DEFAULT_CONFIG } from '../constants';
import { BaseGraphQlClient } from '../graphql-client';

import {
	UnlinkContainerMutation,
	type UnlinkContainerMutationResponse,
	type UnlinkContainerMutationVariables,
} from './utils/mutations/unlink-container-mutation';
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
}

export const aggClient = new AGGClient(DEFAULT_CONFIG.stargateRoot, {
	logException: () => {},
});
