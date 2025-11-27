import { TEAM_ARI_PREFIX, type TeamARI, USER_ARI_PREFIX, type UserARI } from '../types';

export const isUserARI = (ari: string): ari is UserARI => ari.startsWith(USER_ARI_PREFIX);

export const toUserId = (ari: UserARI | string): string => {
	if (isUserARI(ari)) {
		return ari.replace(USER_ARI_PREFIX, '');
	}
	throw new Error('Invalid UserARI');
};

export const toUserARI = (userId: string): UserARI => {
	return isUserARI(userId) ? userId : (`${USER_ARI_PREFIX}${userId}` as UserARI);
};

export const isTeamARI = (ari: string): ari is TeamARI => ari.startsWith(TEAM_ARI_PREFIX);

export const toTeamId = (ari: TeamARI | string): string => {
	if (isTeamARI(ari)) {
		return ari.replace(TEAM_ARI_PREFIX, '');
	}
	throw new Error('Invalid TeamARI');
};

export const toTeamARI = (teamId: string): TeamARI => {
	return isTeamARI(teamId) ? teamId : (`${TEAM_ARI_PREFIX}${teamId}` as TeamARI);
};
