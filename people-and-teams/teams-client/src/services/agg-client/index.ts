import { toUserId } from '../../common/utils/ari';
import { type MembershipState, type TeamMembership } from '../../types';
import { type ClientConfig } from '../base-client';
import { DEFAULT_CONFIG } from '../constants';
import { BaseGraphQlClient } from '../graphql-client';
import { logException } from '../sentry/main';

import { type AGGPageInfoVariables, type ResultWithPageInfo } from './types';
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
}

export const aggClient = new AGGClient(DEFAULT_CONFIG.stargateRoot, {
	logException,
});
