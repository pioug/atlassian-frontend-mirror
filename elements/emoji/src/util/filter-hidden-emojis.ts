import type { EmojiDescription } from '../types';
import { isHiddenEmoji } from './is-hidden-emoji';

export const filterHiddenEmojis = <Emoji extends EmojiDescription>(emojis: Emoji[]): Emoji[] =>
	emojis.filter((emoji) => !isHiddenEmoji(emoji));
