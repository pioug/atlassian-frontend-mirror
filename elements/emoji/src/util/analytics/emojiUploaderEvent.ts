import { createEvent } from './createEvent';

export const emojiUploaderEvent: any = (
	action: string,
	actionSubjectId?: string,
	attributes?: any,
) => createEvent('ui', action, 'emojiUploader', actionSubjectId, attributes);
