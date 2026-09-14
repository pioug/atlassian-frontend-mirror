import type { EmojiVariationDescription } from '../types';

export const isEmojiVariationDescription = (object: any): object is EmojiVariationDescription => {
	return 'baseId' in object;
};
