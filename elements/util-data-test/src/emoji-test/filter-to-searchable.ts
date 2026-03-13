import { type EmojiDescription } from '@atlaskit/emoji/types';

export const filterToSearchable = (emojis: EmojiDescription[]): EmojiDescription[] =>
	emojis.filter((emoji) => emoji.searchable);
