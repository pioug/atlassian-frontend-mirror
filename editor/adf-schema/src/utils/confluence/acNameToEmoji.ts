import { acNameToEmojiMap } from './acNameToEmojiMap';
import { DEFAULT_EMOJI_ID } from './emoji';
import type { NameToEmoji } from './emoji';

export function acNameToEmoji(acName: NameToEmoji): {
	id: string;
	shortName: string;
	text: string;
} {
	const emojiData = acNameToEmojiMap[acName];
	return emojiData
		? {
				id: emojiData[0],
				shortName: emojiData[1],
				text: emojiData[2],
			}
		: {
				id: DEFAULT_EMOJI_ID,
				shortName: `:${acName}:`,
				text: '',
			};
}
