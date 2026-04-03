import { DEFAULT_CONFIG } from '../constants';
import { RestClient } from '../rest-client';

const defaultConfig = {
	serviceUrl: `${DEFAULT_CONFIG.stargateRoot}/teamsslack/api/team`,
};

interface TeamInSlackResponse {
	connected: boolean;
	slackChannelId: string;
	slackChannelName: string;
	usergroupHandle: string;
}

export class TeamsInSlackClient extends RestClient {
	constructor(config = {}) {
		super({ ...defaultConfig, ...config });
	}

	async getTeamInSlack(teamId: string, teamName: string): Promise<{
        connected: boolean;
        slackChannelId: string;
        slackChannelName: string;
        usergroupHandle: string;
        id: string;
    }> {
		return this.getResource<TeamInSlackResponse>(
			`/${teamId}?teamName=${encodeURIComponent(teamName)}`,
		).then((response) => ({
			id: teamId,
			...response,
		}));
	}
	async disconnectTeamInSlack(teamId: string): Promise<{
        connected: boolean;
        slackChannelId: string;
        slackChannelName: string;
        usergroupHandle: string;
        id: string;
    }> {
		return this.deleteResource<TeamInSlackResponse>(`/${teamId}`).then((response) => ({
			id: teamId,
			...response,
		}));
	}

	async updateTeamInSlack(teamId: string, channelId: string, usergroupHandle: string): Promise<{
        connected: boolean;
        slackChannelId: string;
        slackChannelName: string;
        usergroupHandle: string;
        id: string;
    }> {
		return this.postResource<TeamInSlackResponse>(
			`/${teamId}?channel=${channelId}&groupName=${usergroupHandle}`,
		).then((response) => ({
			id: teamId,
			...response,
		}));
	}
}

const _default_1: TeamsInSlackClient = new TeamsInSlackClient();
export default _default_1;
