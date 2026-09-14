import { TEAM_ARI_PREFIX, type TeamARI } from '../types';

import { isTeamARI } from './is-team-ari';

export const toTeamARI = (teamId: string): TeamARI => {
	return isTeamARI(teamId) ? teamId : (`${TEAM_ARI_PREFIX}${teamId}` as TeamARI);
};
