import { type SearchSourceTypes } from '../../types';
import type { EmojiInsertionAnalytic } from './analytics';
import { createEvent } from './createEvent';

export const recordSucceeded: EmojiInsertionAnalytic = (source: SearchSourceTypes) => {
	return createEvent('operational', 'succeeded', 'recordEmojiSelection', undefined, {
		source,
	});
};
