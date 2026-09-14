import { createEvent } from './createEvent';

export const emojiPickerEvent: any = (action: string, attributes = {}, actionSubjectId?: string) =>
	createEvent('ui', action, 'emojiPicker', actionSubjectId, attributes);
