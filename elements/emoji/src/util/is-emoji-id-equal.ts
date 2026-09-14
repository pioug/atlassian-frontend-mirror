import type { EmojiId } from '../types';

export const isEmojiIdEqual = (l?: EmojiId, r?: EmojiId): boolean | undefined =>
	l === r || (l && r && l.id === r.id && l.shortName === r.shortName);
