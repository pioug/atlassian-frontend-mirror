import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent';

import { emojiUploaderEvent } from './emojiUploaderEvent';

export const uploadBeginButton = (): AnalyticsEventPayload =>
	emojiUploaderEvent('clicked', 'addButton');
