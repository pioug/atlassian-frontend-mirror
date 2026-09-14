import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent'; // eslint-disable-line @typescript-eslint/consistent-type-imports

import type { Duration } from './Duration';
import { emojiPickerEvent } from './emojiPickerEvent';
import { getSkinTone } from './getSkinTone';

interface EmojiAttributes {
	baseEmojiId?: string; // mobile only
	category: string;
	emojiId: string;
	skinToneModifier?: string;
	type: string;
}

export const pickerClickedEvent = (
	attributes: { queryLength: number } & EmojiAttributes & Duration,
): AnalyticsEventPayload =>
	emojiPickerEvent(
		'clicked',
		{
			...getSkinTone(attributes.emojiId),
			...attributes,
		},
		'emoji',
	);
