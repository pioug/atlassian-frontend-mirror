import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent';

import type { Duration } from './Duration';
import { emojiPickerEvent } from './emojiPickerEvent';

export const closedPickerEvent = (attributes: Duration): AnalyticsEventPayload =>
	emojiPickerEvent('closed', attributes);
