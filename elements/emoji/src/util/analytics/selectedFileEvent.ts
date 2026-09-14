import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent'; // eslint-disable-line @typescript-eslint/consistent-type-imports

import { createEvent } from './createEvent';

export const selectedFileEvent = (): AnalyticsEventPayload =>
	createEvent('ui', 'clicked', 'emojiUploader', 'selectFile');
