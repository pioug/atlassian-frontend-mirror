import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent'; // eslint-disable-line @typescript-eslint/consistent-type-imports

import type { Attributes } from './Attributes';
import { createEvent } from './createEvent';

export const deleteBeginEvent = (attributes: Attributes): AnalyticsEventPayload =>
	createEvent('ui', 'clicked', 'emojiPicker', 'deleteEmojiTrigger', attributes);
