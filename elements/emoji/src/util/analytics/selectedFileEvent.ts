import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent';

import { createEvent } from './createEvent';

export const selectedFileEvent = (): AnalyticsEventPayload =>
	createEvent('ui', 'clicked', 'emojiUploader', 'selectFile');
