import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent'; // eslint-disable-line @typescript-eslint/consistent-type-imports

import { type EmojiDescription } from '../../types';
import { createEvent } from './createEvent';
import { extractCommonAttributes } from './extractCommonAttributes';

export const typeaheadRenderedEvent = (
	duration: number,
	query?: string,
	emojiList?: EmojiDescription[],
): AnalyticsEventPayload =>
	createEvent('operational', 'rendered', 'emojiTypeahead', undefined, {
		duration,
		...extractCommonAttributes(query, emojiList),
	});
