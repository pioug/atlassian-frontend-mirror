import { type EmojiDescription } from '../../types';
import type { CommonAttributes } from './CommonAttributes';

export const extractCommonAttributes = (
	query?: string,
	emojiList?: EmojiDescription[],
): CommonAttributes => {
	return {
		queryLength: query ? query.length : 0,
		spaceInQuery: query ? query.indexOf(' ') !== -1 : false,
		emojiIds: emojiList
			? emojiList
					.map((emoji) => emoji.id!)
					.filter(Boolean)
					.slice(0, 20)
			: [],
	};
};
