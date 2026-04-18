import memoizeOne, { type MemoizedFn } from 'memoize-one';
import { denormaliseEmojiServiceResponse } from '@atlaskit/emoji/utils';
import { getAtlassianEmojiData } from './get-atlassian-emoji-data';
import type { EmojiDescriptionWithVariations } from '@atlaskit/emoji';

export const getAtlassianEmojis: MemoizedFn<() => EmojiDescriptionWithVariations[]> = memoizeOne(
	(): EmojiDescriptionWithVariations[] => {
		const atlassianEmojis = getAtlassianEmojiData();
		const atlassianSprites = atlassianEmojis?.meta?.spriteSheets ?? {};

		return denormaliseEmojiServiceResponse({
			emojis: atlassianEmojis.emojis,
			meta: {
				spriteSheets: atlassianSprites,
			},
		}).emojis;
	},
);
