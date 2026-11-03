import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent';

import type { Attributes } from './Attributes';
import { createEvent } from './createEvent';

export const deleteConfirmEvent = (attributes: Attributes): AnalyticsEventPayload =>
	createEvent('ui', 'clicked', 'emojiPicker', 'deleteEmojiConfirm', attributes);
