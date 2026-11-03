import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent';

import { skintoneSelectorEvent } from './skintoneSelectorEvent';

export const toneSelectedEvent = (attributes: {
	skinToneModifier: string;
}): AnalyticsEventPayload => skintoneSelectorEvent('clicked', attributes);
