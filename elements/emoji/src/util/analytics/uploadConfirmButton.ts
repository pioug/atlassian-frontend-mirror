import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent';

import { emojiUploaderEvent } from './emojiUploaderEvent';

export const uploadConfirmButton = (attributes: { retry: boolean }): AnalyticsEventPayload =>
	emojiUploaderEvent('clicked', 'confirmButton', attributes);
