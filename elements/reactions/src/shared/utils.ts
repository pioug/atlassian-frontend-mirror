import { EmojiId } from '@atlaskit/emoji/types';
import { DefaultReactions } from './constants';

/**
 * Is selected mouse event a left click
 * @param event event data
 */
export const isLeftClick = (event: React.MouseEvent<HTMLElement>) =>
  event.button === 0 &&
  !event.altKey &&
  !event.ctrlKey &&
  !event.metaKey &&
  !event.shiftKey;

/**
 * Does provided item part of the default emoji ids
 * @param item selected emoji item
 */
export const isDefaultReaction = (item: EmojiId) =>
  DefaultReactions.some((otherEmojiId) => isEqualEmojiId(otherEmojiId, item));

/**
 * compare 2 emoji items if they are same input
 * @param a first emoji item
 * @param b second emoji item
 */
const isEqualEmojiId = (a: EmojiId | string, b: EmojiId | string): boolean => {
  if (isEmojiId(a) && isEmojiId(b)) {
    return a === b || (a && b && a.id === b.id && a.shortName === b.shortName);
  } else {
    return a === b;
  }
};

/**
 * Type guard if provided object is a string id or an object info collection for the emoji
 * @param item given item
 */
const isEmojiId = (item: EmojiId | string): item is EmojiId => {
  return (item as EmojiId).id !== undefined;
};
