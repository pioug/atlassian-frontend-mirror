import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent'; // eslint-disable-line @typescript-eslint/consistent-type-imports

import type { Duration } from './Duration';
import { emojiPickerEvent } from './emojiPickerEvent';

export const closedPickerEvent = (attributes: Duration): AnalyticsEventPayload =>
	emojiPickerEvent('closed', attributes);
