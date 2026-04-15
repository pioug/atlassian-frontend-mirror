import memoizeOne, { type MemoizedFn } from 'memoize-one';
import { denormaliseEmojiServiceResponse } from '@atlaskit/emoji/utils';
import { getStandardEmojiData } from './get-standard-emoji-data';
import type { EmojiDescriptionWithVariations } from '@atlaskit/emoji';

export const getStandardEmojis: MemoizedFn<() => EmojiDescriptionWithVariations[]> = memoizeOne((): EmojiDescriptionWithVariations[] => {
	const standardEmojis = getStandardEmojiData();
	const standardSprites = standardEmojis?.meta?.spriteSheets ?? {};

	return denormaliseEmojiServiceResponse({
		emojis: standardEmojis.emojis,
		meta: {
			spriteSheets: standardSprites,
		},
	}).emojis;
});
