import { TEAM_ARI_PREFIX, type TeamARI } from '../types';
import { isTeamARI } from './is-team-ari';

export const toTeamId = (ari: TeamARI | string): string => {
	if (isTeamARI(ari)) {
		return ari.replace(TEAM_ARI_PREFIX, '');
	}
	throw new Error('Invalid TeamARI');
};
