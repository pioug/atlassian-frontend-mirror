import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent'; // eslint-disable-line @typescript-eslint/consistent-type-imports

import { emojiPickerEvent } from './emojiPickerEvent';

export const categoryClickedEvent = (attributes: { category: string }): AnalyticsEventPayload =>
	emojiPickerEvent('clicked', attributes, 'category');
