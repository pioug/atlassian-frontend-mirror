import { createEvent } from './createEvent';

export const skintoneSelectorEvent: any = (action: string, attributes = {}) =>
	createEvent('ui', action, 'emojiSkintoneSelector', undefined, attributes);
