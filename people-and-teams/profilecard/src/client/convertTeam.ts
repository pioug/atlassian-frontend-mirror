/// <reference types="node" />
// for typing `process`

import type { Team } from '../types';

import { extractIdFromAri } from './extractIdFromAri';
import type { AGGResult } from './getTeamFromAGG';

export const convertTeam = (result: AGGResult): Team => {
	const { team } = result;
	return {
		...team,
		id: extractIdFromAri(team.id),
		members: team.members?.nodes.map(({ member }) => ({
			id: member.accountId,
			fullName: member.name,
			avatarUrl: member.picture,
		})),
	};
};
