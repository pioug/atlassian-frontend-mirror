import memoizeOne, { type MemoizedFn } from 'memoize-one';

import type { EmojiDescriptionWithVariations } from '@atlaskit/emoji';
import { denormaliseEmojiServiceResponse } from '@atlaskit/emoji/utils';

import { getStandardEmojiData } from './get-standard-emoji-data';

export const getStandardEmojis: MemoizedFn<() => EmojiDescriptionWithVariations[]> = memoizeOne(
	(): EmojiDescriptionWithVariations[] => {
		const standardEmojis = getStandardEmojiData();
		const standardSprites = standardEmojis?.meta?.spriteSheets ?? {};

		return denormaliseEmojiServiceResponse({
			emojis: standardEmojis.emojis,
			meta: {
				spriteSheets: standardSprites,
			},
		}).emojis;
	},
);
