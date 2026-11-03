import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent';

import { emojiUploaderEvent } from './emojiUploaderEvent';

export const uploadCancelButton = (): AnalyticsEventPayload =>
	emojiUploaderEvent('clicked', 'cancelButton');
