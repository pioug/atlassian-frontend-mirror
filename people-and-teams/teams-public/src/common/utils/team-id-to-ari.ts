export const ARI_PREFIX = 'ari:cloud:identity::team/';

export const teamIdToAri = (teamIdOrTeamAri: string) =>
	teamIdOrTeamAri.startsWith(ARI_PREFIX) ? teamIdOrTeamAri : `${ARI_PREFIX}${teamIdOrTeamAri}`;
