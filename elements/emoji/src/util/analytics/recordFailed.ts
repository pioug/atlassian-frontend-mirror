import { type SearchSourceTypes } from '../../types';
import type { EmojiInsertionAnalytic } from './analytics';
import { createEvent } from './createEvent';

export const recordFailed: EmojiInsertionAnalytic = (source: SearchSourceTypes) => {
	return createEvent('operational', 'failed', 'recordEmojiSelection', undefined, {
		source,
	});
};
