import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent'; // eslint-disable-line @typescript-eslint/consistent-type-imports

import { createEvent } from './createEvent';

const aiEmojiGenerationEvent = (
	action: string,
	actionSubjectId?: string,
	attributes?: any,
): AnalyticsEventPayload =>
	createEvent('ui', action, 'emojiPickerAiGeneration', actionSubjectId, attributes);

export const aiGenerationStartedEvent = (attributes: {
	promptLength: number;
}): AnalyticsEventPayload => aiEmojiGenerationEvent('started', 'generateButton', attributes);
