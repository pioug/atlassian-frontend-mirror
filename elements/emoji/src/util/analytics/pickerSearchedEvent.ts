import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent'; // eslint-disable-line @typescript-eslint/consistent-type-imports

import { emojiPickerEvent } from './emojiPickerEvent';

export const pickerSearchedEvent = (attributes: {
	numMatches: number;
	queryLength: number;
}): AnalyticsEventPayload => emojiPickerEvent('searched', attributes, 'query');
