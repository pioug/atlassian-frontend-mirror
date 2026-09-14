import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent'; // eslint-disable-line @typescript-eslint/consistent-type-imports

import { skintoneSelectorEvent } from './skintoneSelectorEvent';

export const toneSelectorOpenedEvent = (attributes: {
	skinToneModifier?: string;
}): AnalyticsEventPayload => skintoneSelectorEvent('opened', attributes);
