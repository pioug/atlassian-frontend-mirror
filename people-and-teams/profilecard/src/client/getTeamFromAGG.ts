/// <reference types="node" />
// for typing `process`

import type { Team } from '../types';

import { AGGQuery } from './AGGQuery';
import { addHeaders } from './addHeaders';
import { buildGatewayQuery } from './buildGatewayQuery';
import { convertTeam } from './convertTeam';

interface AGGTeam extends Omit<Team, 'members'> {
	members?: {
		nodes: AGGMember[];
	};
}

interface AGGMember {
	member: {
		accountId: string;
		name: string;
		picture: string;
	};
}

export interface AGGResult {
	team: AGGTeam;
}

export async function getTeamFromAGG(url: string, teamId: string, siteId?: string): Promise<Team> {
	const query = buildGatewayQuery({
		teamId,
		siteId,
	});

	const { Team } = await AGGQuery<{ Team: AGGResult }>(url, query, addHeaders);

	return convertTeam(Team);
}
