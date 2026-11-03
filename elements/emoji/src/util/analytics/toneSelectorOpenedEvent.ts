import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent';

import { skintoneSelectorEvent } from './skintoneSelectorEvent';

export const toneSelectorOpenedEvent = (attributes: {
	skinToneModifier?: string;
}): AnalyticsEventPayload => skintoneSelectorEvent('opened', attributes);
