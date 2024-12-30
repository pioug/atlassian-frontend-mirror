import type { MentionDescription } from '@atlaskit/mention';

import { INVITE_ITEM_DESCRIPTION } from '../InviteItem';

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isTeamType = (userType: any): boolean => userType === 'TEAM';

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isTeamStats = (stat: any): boolean => stat && !isNaN(stat.teamMentionDuration);

export const isInviteItem = (mention: MentionDescription): boolean =>
	mention && mention.id === INVITE_ITEM_DESCRIPTION.id;

/**
 * Actions
 */
export const shouldKeepInviteItem = (query: string, firstQueryWithoutResults: string): boolean => {
	if (!firstQueryWithoutResults) {
		return true;
	}
	const lastIndexWithResults = firstQueryWithoutResults.length - 1;
	let suffix = query.slice(lastIndexWithResults);
	if (query[lastIndexWithResults - 1] === ' ') {
		suffix = ' ' + suffix;
	}
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	const depletedExtraWords = /\s[^\s]+\s/.test(suffix);
	return !depletedExtraWords;
};
