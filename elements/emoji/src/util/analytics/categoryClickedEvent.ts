import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent';

import { emojiPickerEvent } from './emojiPickerEvent';

export const categoryClickedEvent = (attributes: { category: string }): AnalyticsEventPayload =>
	emojiPickerEvent('clicked', attributes, 'category');
