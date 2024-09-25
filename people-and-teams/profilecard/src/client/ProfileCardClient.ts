import { type AnalyticsEventPayload } from '@atlaskit/analytics-next';
import { isFedRamp } from '@atlaskit/atlassian-context';
import { fg } from '@atlaskit/platform-feature-flags';

import {
	type AgentIdType,
	type ClientOverrides,
	type ProfileClient,
	type ProfileClientOptions,
	type TeamCentralReportingLinesData,
} from '../types';

import RovoAgentCardClient from './RovoAgentCardClient';
import TeamCentralCardClient from './TeamCentralCardClient';
import TeamProfileCardClient from './TeamProfileCardClient';
import UserProfileCardClient from './UserProfileCardClient';

const defaultConfig: Partial<ProfileClientOptions> = {
	gatewayGraphqlUrl: '/gateway/api/graphql',
};

class ProfileCardClient implements ProfileClient {
	userClient: UserProfileCardClient;
	teamClient: TeamProfileCardClient;
	tcClient?: TeamCentralCardClient;
	rovoAgentClient: RovoAgentCardClient;

	constructor(config: ProfileClientOptions, clients?: ClientOverrides) {
		//This default can be removed once all the clients are updated to pass the gatewayGraphqlUrl
		const withDefaultConfig = {
			...defaultConfig,
			...config,
			...{ gatewayGraphqlUrl: config.gatewayGraphqlUrl ?? defaultConfig.gatewayGraphqlUrl },
		};
		this.userClient = clients?.userClient || new UserProfileCardClient(withDefaultConfig);
		this.teamClient = clients?.teamClient || new TeamProfileCardClient(withDefaultConfig);
		this.rovoAgentClient = clients?.rovoAgentClient || new RovoAgentCardClient(withDefaultConfig);
		this.tcClient = maybeCreateTeamCentralClient(config, clients);
	}

	flushCache() {
		this.userClient.flushCache();
		this.teamClient.flushCache();
		this.tcClient?.flushCache();
		this.rovoAgentClient?.flushCache();
	}

	getProfile(
		cloudId: string,
		userId: string,
		analytics?: (event: AnalyticsEventPayload) => void,
	): Promise<any> {
		return this.userClient.getProfile(cloudId, userId, analytics);
	}

	getTeamProfile(
		teamId: string,
		orgId?: string,
		analytics?: (event: AnalyticsEventPayload) => void,
	) {
		return this.teamClient.getProfile(teamId, orgId, analytics);
	}

	getReportingLines(userId: string): Promise<TeamCentralReportingLinesData> {
		return (
			this.tcClient?.getReportingLines(userId) || Promise.resolve({ managers: [], reports: [] })
		);
	}

	getTeamCentralBaseUrl() {
		return this.tcClient?.options.teamCentralBaseUrl;
	}

	shouldShowGiveKudos(): Promise<boolean> {
		if (!this.tcClient || !this.getTeamCentralBaseUrl()) {
			return Promise.resolve(false);
		}
		return this.tcClient.checkWorkspaceExists();
	}

	getRovoAgentProfile(id: AgentIdType, analytics?: (event: AnalyticsEventPayload) => void) {
		return this.rovoAgentClient?.getProfile(id, analytics);
	}
	deleteAgent(id: string, analytics?: (event: AnalyticsEventPayload) => void) {
		return this.rovoAgentClient?.deleteAgent(id, analytics);
	}

	setFavouriteAgent(
		id: string,
		isFavourite: boolean,
		analytics?: (event: AnalyticsEventPayload) => void,
	) {
		return this.rovoAgentClient?.setFavouriteAgent(id, isFavourite, analytics);
	}
}

function maybeCreateTeamCentralClient(config: ProfileClientOptions, clients?: ClientOverrides) {
	if (isFedRamp()) {
		return undefined;
	}

	if (clients?.teamCentralClient) {
		return clients.teamCentralClient;
	}
	const teamCentralEnabled = fg('enable_ptc_sharded_townsquare_calls')
		? config.teamCentralDisabled !== true
		: config.teamCentralUrl;
	return teamCentralEnabled ? new TeamCentralCardClient({ ...config }) : undefined;
}

export default ProfileCardClient;
