import ProfileCardClient from '../client/ProfileCardClient';
import RovoAgentCardClient from '../client/RovoAgentCardClient';
import TeamProfileCardClient from '../client/TeamProfileCardClient';
import UserProfileCardClient from '../client/UserProfileCardClient';
import {
	type AgentIdType,
	type ProfileCardClientData,
	type RovoAgentCardClientResult,
	type Team,
} from '../types';

import agentData, { agentAggData } from './agent-data';
import profiles from './profile-data';
import teamData from './team-data';
import { getTimeString, getWeekday } from './util';

class SimpleMockTeamClient extends TeamProfileCardClient {
	makeRequest(teamId: string): Promise<Team> {
		const simpleMockTeam = teamData({
			members: 5,
		});

		return Promise.resolve({
			teamId,
			...simpleMockTeam,
		});
	}
}

class SimpleMockUserClient extends UserProfileCardClient {
	makeRequest(cloudId: string, userId: string): Promise<ProfileCardClientData> {
		const profile = profiles[0];

		const weekday = getWeekday();
		const data: any = { ...profile };

		data.remoteTimeString = getTimeString();
		data.remoteWeekdayIndex = weekday.index;
		data.remoteWeekdayString = weekday.string;

		return Promise.resolve(data);
	}
}

class SimpleMockAgentClient extends RovoAgentCardClient {
	makeRequest(id: AgentIdType): Promise<RovoAgentCardClientResult> {
		return Promise.resolve({
			restData: agentData,
			aggData: agentAggData,
		});
	}
}

const args = {
	cacheSize: 10,
	maxCacheAge: 0,
	url: '/graphql/directory',
	gatewayGraphqlUrl: '/gateway/api/graphql',
};
export const simpleMockUserClient = new SimpleMockUserClient(args);
export const simpleMockTeamClient = new SimpleMockTeamClient(args);
export const simpleMockAgentClient = new SimpleMockAgentClient(args);

export const simpleProfileClient = new ProfileCardClient(args, {
	userClient: simpleMockUserClient,
	teamClient: simpleMockTeamClient,
	rovoAgentClient: simpleMockAgentClient,
});
