import { EmojiId } from '@atlaskit/emoji/types';

export const akHeight = 24;

export const isLeftClick = (event: React.MouseEvent<HTMLElement>) =>
  event.button === 0 &&
  !event.altKey &&
  !event.ctrlKey &&
  !event.metaKey &&
  !event.shiftKey;

export const equalEmojiId = (
  l: EmojiId | string,
  r: EmojiId | string,
): boolean => {
  if (isEmojiId(l) && isEmojiId(r)) {
    return l === r || (l && r && l.id === r.id && l.shortName === r.shortName);
  } else {
    return l === r;
  }
};

const isEmojiId = (emojiId: EmojiId | string): emojiId is EmojiId => {
  return (emojiId as EmojiId).id !== undefined;
};
