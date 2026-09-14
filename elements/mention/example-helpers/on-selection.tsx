import { type MentionDescription, type OnMentionEvent } from '../src/types';
import debug from '../src/util/logger';

export const onSelection: OnMentionEvent = (mention: MentionDescription) =>
	debug('onSelection ', mention);
