import memoizeOne, { type MemoizedFn } from 'memoize-one';
import { denormaliseEmojiServiceResponse } from '@atlaskit/emoji/utils';
import { getSiteEmojiData } from './get-site-emoji-data';
import type { EmojiDescriptionWithVariations } from '@atlaskit/emoji';

export const getSiteEmojis: MemoizedFn<() => EmojiDescriptionWithVariations[]> = memoizeOne((): EmojiDescriptionWithVariations[] => {
	return denormaliseEmojiServiceResponse({
		emojis: getSiteEmojiData().emojis,
	}).emojis;
});
