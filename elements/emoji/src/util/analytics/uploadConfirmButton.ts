import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent'; // eslint-disable-line @typescript-eslint/consistent-type-imports

import { emojiUploaderEvent } from './emojiUploaderEvent';

export const uploadConfirmButton = (attributes: { retry: boolean }): AnalyticsEventPayload =>
	emojiUploaderEvent('clicked', 'confirmButton', attributes);
