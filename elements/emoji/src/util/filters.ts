import type { EmojiDescription } from '../types';

export const toneEmojiShortName: any = ':raised_hand:';

const byShortName = (emojis: EmojiDescription[], shortName: string): EmojiDescription =>
	emojis.filter((emoji) => emoji.shortName === shortName)[0];

const toneEmoji = (emojis: EmojiDescription[]): EmojiDescription =>
	byShortName(emojis, toneEmojiShortName);

const _default_1: {
	byShortName: (emojis: EmojiDescription[], shortName: string) => EmojiDescription;
	toneEmoji: (emojis: EmojiDescription[]) => EmojiDescription;
} = {
	byShortName,
	toneEmoji,
};

export default _default_1;
