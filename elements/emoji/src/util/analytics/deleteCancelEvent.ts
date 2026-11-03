import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent';

import type { Attributes } from './Attributes';
import { createEvent } from './createEvent';

export const deleteCancelEvent = (attributes: Attributes): AnalyticsEventPayload =>
	createEvent('ui', 'clicked', 'emojiPicker', 'deleteEmojiCancel', attributes);
