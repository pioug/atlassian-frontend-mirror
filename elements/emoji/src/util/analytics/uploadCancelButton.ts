import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent'; // eslint-disable-line @typescript-eslint/consistent-type-imports

import { emojiUploaderEvent } from './emojiUploaderEvent';

export const uploadCancelButton = (): AnalyticsEventPayload =>
	emojiUploaderEvent('clicked', 'cancelButton');
