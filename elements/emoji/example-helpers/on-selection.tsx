import type { OnEmojiEvent } from '../src/types';
import debug from '../src/util/logger';

export const onSelection: OnEmojiEvent = (emojiId, emoji) =>
	debug('emoji selected', emojiId, emoji);
