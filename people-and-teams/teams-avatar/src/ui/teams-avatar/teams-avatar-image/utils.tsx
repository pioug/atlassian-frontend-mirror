import { fg } from '@atlaskit/platform-feature-flags';

import { TEAM_FALLBACK_AVATAR_DATA_URI } from './fallback/constants';

/**
 * If a src value is given, we'll use that directly.
 * Otherwise we'll generate a static URL from the teamId.
 * If neither are provided, return undefined so that the fallback will be used.
 */
export function getTeamAvatarSrc(src?: string, teamId?: string): string | undefined {
	if (src) {
		return src;
	} else if (teamId) {
		return `/gateway/api/v4/teams/${teamId}/avatar`;
	}
	return fg('enable_teams_t26_design_drop_core_experiences')
		? TEAM_FALLBACK_AVATAR_DATA_URI
		: undefined;
}
