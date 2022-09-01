import { EmojiId } from '@atlaskit/emoji/types';

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
 * ES6 Map object from default emoji reactions (with key => shortName, value => entire emoji item)
 */
export const DefaultReactionsByShortName = new Map<string, EmojiId>(
  DefaultReactions.map((reaction) => [reaction.shortName, reaction]),
);

/**
 * Maximum number of users to show in the tooltip for an emoji reaction
 */
export const TOOLTIP_USERS_LIMIT = 5;
