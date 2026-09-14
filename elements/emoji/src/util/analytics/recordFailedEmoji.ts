import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent'; // eslint-disable-line @typescript-eslint/consistent-type-imports

import { type OptionalEmojiDescription, type SearchSourceTypes } from '../../types';
import { createEvent } from './createEvent';

export const recordFailedEmoji: any =
	(emoji: OptionalEmojiDescription) =>
	(source: SearchSourceTypes): AnalyticsEventPayload => {
		return createEvent('operational', 'failed', 'recordEmojiSelection', undefined, {
			source,
			emojiId: emoji?.id,
			emojiType: emoji?.type,
			emojiCategory: emoji?.category,
		});
	};
