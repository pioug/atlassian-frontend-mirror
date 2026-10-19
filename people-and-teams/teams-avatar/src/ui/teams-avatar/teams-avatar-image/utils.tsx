import { TEAM_FALLBACK_AVATAR_DATA_URI } from './fallback/constants';

/**
 * If a src value is given, we'll use that directly.
 * Otherwise we'll generate a static URL from the teamId.
 * If neither are provided, return the fallback avatar.
 */
export function getTeamAvatarSrc(src?: string, teamId?: string): string {
	if (src) {
		return src;
	} else if (teamId) {
		return `/gateway/api/v4/teams/${teamId}/avatar`;
	}
	return TEAM_FALLBACK_AVATAR_DATA_URI;
}
