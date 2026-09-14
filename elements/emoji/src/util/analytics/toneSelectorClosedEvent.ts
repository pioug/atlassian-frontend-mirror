import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent'; // eslint-disable-line @typescript-eslint/consistent-type-imports

import { skintoneSelectorEvent } from './skintoneSelectorEvent';

export const toneSelectorClosedEvent = (): AnalyticsEventPayload =>
	skintoneSelectorEvent('cancelled');
