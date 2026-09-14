import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent'; // eslint-disable-line @typescript-eslint/consistent-type-imports

import { emojiPickerEvent } from './emojiPickerEvent';

export const openedPickerEvent = (): AnalyticsEventPayload => emojiPickerEvent('opened');
