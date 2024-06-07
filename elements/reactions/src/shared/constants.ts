import { type EmojiId } from '@atlaskit/emoji/types';

/**
 * Initial list of emoji to pick from
 */
export const DefaultReactions: EmojiId[] = [
	{ id: '1f44d', shortName: ':thumbsup:' },
	{ id: '1f44f', shortName: ':clap:' },
	{ id: '1f525', shortName: ':fire:' },
	{ id: '2764', shortName: ':heart:' },
	{ id: '1f632', shortName: ':astonished:' },
	{ id: '1f914', shortName: ':thinking:' },
];

/**
 * Extended list of reactions used only for examples
 */
export const ExtendedReactions: EmojiId[] = [
	{ id: '1f44d', shortName: ':thumbsup:' },
	{ id: '1f44f', shortName: ':clap:' },
	{ id: '1f525', shortName: ':fire:' },
	{ id: '2764', shortName: ':heart:' },
	{ id: '1f632', shortName: ':astonished:' },
	{ id: '1f914', shortName: ':thinking:' },
	{ id: '1f44e', shortName: ':thumbsdown:' },
	{ id: '1f4a1', shortName: ':bulb:' },
	{ id: '2b50', shortName: ':star:' },
	{ id: '1f49a', shortName: ':green_heart:' },
	{ id: '1f499', shortName: ':blue_heart:' },
	{ id: '1f494', shortName: ':broken_heart:' },
	{ id: '1f600', shortName: ':grinning:' },
	{ id: '1f642', shortName: ':slight_smile:' },
];

/**
 * ES6 Map object from default emoji reactions (with key => shortName, value => entire emoji item)
 */
export const DefaultReactionsByShortName = new Map<string, EmojiId>(
	DefaultReactions.map((reaction) => [reaction.shortName, reaction]),
);

/**
 * ES6 Map object from default emoji reactions (with key => shortName, value => entire emoji item)
 * Only for use in extended reaction examples
 */
export const ExtendedReactionsByShortName = new Map<string, EmojiId>(
	ExtendedReactions.map((reaction) => [reaction.shortName, reaction]),
);

/**
 * Maximum number of users to show in the tooltip for an emoji reaction
 */
export const TOOLTIP_USERS_LIMIT = 5;

/**
 * Maximum number of reactions that will fit in the horizontal scroll of
 * reactions dialog
 */
export const NUMBER_OF_REACTIONS_TO_DISPLAY = 9;

// This rate is used in fetching emoji resource
export const SAMPLING_RATE_REACTIONS_RENDERED_EXP = 50;
