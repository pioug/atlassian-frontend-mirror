import { AGENT_MENTION_LOAD_ERROR_ID, type MentionDescription } from '@atlaskit/mention/types';

import { INVITE_ITEM_DESCRIPTION } from '../InviteItem';

// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const SUFFIX_WITH_EXTRA_WORDS_REGEX = /\s[^\s]+\s/;

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isTeamType = (userType: any): boolean => userType === 'TEAM';

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isTeamStats = (stat: any): boolean => stat && !isNaN(stat.teamMentionDuration);

export const isInviteItem = (mention: MentionDescription): boolean =>
	mention && mention.id === INVITE_ITEM_DESCRIPTION.id;

export const isAgentUserType = (userType: string | undefined): boolean =>
	userType === 'APP' || userType === 'AGENT';

export const isAgentMention = (
	mention: Pick<MentionDescription, 'appType' | 'userType'>,
): boolean => isAgentUserType(mention.userType) || mention.appType === 'agent';

/**
 * True when the mention is explicitly an agent, not a generic APP/bot.
 * Prefer this over `isAgentMention` when ordering the search display
 * list behind `platform_editor_mention_search_order` — bare `userType: 'APP'`
 * is a bot unless `appType === 'agent'`.
 */
export const isExplicitAgentMention = (
	mention: Pick<MentionDescription, 'appType' | 'userType'>,
): boolean => mention.appType === 'agent' || mention.userType === 'AGENT';

export const isAgentMentionLoadError = (
	mention:
		| (Partial<Pick<MentionDescription, 'appType' | 'id' | 'isPlaceholder' | 'userType'>> & {
				placeholderType?: string;
		  })
		| undefined,
): boolean =>
	mention?.id === AGENT_MENTION_LOAD_ERROR_ID &&
	mention.isPlaceholder === true &&
	mention.placeholderType === 'error' &&
	mention.appType === 'agent';

/**
 * Connect/app bots and teams. Explicit agents are excluded so they can be
 * lifted above this group in the hardcoded display order.
 */
export const isBotOrTeamMention = (
	mention: Pick<MentionDescription, 'appType' | 'userType'>,
): boolean => {
	if (isExplicitAgentMention(mention)) {
		return false;
	}
	return mention.userType === 'TEAM' || mention.userType === 'APP';
};

export type MentionDisplayGroup = 'people' | 'agents' | 'bots-teams';

export const getMentionDisplayGroup = (
	mention: Pick<MentionDescription, 'appType' | 'userType'>,
): MentionDisplayGroup => {
	if (isExplicitAgentMention(mention)) {
		return 'agents';
	}
	if (isBotOrTeamMention(mention)) {
		return 'bots-teams';
	}
	return 'people';
};

/**
 * Hardcoded mention display order: people, then agents, then bots/teams.
 * Stable within each group so provider ranking is preserved.
 */
export const orderMentionsForDisplay = <T extends Pick<MentionDescription, 'appType' | 'userType'>>(
	mentions: readonly T[],
): T[] => {
	const people: T[] = [];
	const agents: T[] = [];
	const botsAndTeams: T[] = [];

	for (const mention of mentions) {
		const group = getMentionDisplayGroup(mention);
		if (group === 'agents') {
			agents.push(mention);
		} else if (group === 'bots-teams') {
			botsAndTeams.push(mention);
		} else {
			people.push(mention);
		}
	}

	return [...people, ...agents, ...botsAndTeams];
};

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
	const depletedExtraWords = SUFFIX_WITH_EXTRA_WORDS_REGEX.test(suffix);
	return !depletedExtraWords;
};
