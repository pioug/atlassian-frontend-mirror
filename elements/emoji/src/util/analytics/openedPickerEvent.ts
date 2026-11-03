import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent';

import { emojiPickerEvent } from './emojiPickerEvent';

export const openedPickerEvent = (): AnalyticsEventPayload => emojiPickerEvent('opened');
