import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent'; // eslint-disable-line @typescript-eslint/consistent-type-imports

import { createEvent } from './createEvent';

export const aiGenerationFailedEvent = (attributes: { errorType: string }): AnalyticsEventPayload =>
	createEvent('operational', 'failed', 'emojiPickerAiGeneration', undefined, attributes);
