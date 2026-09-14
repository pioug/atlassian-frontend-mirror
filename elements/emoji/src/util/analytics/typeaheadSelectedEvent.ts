import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent'; // eslint-disable-line @typescript-eslint/consistent-type-imports

import { type EmojiDescription } from '../../types';
import { createEvent } from './createEvent';
import { extractCommonAttributes } from './extractCommonAttributes';
import { getSkinTone } from './getSkinTone';

const getPosition = (
	emojiList: EmojiDescription[] | undefined,
	selectedEmoji: EmojiDescription,
): number | undefined => {
	if (emojiList) {
		const index = emojiList.findIndex((emoji) => emoji.id === selectedEmoji.id);
		return index === -1 ? undefined : index;
	}
	return;
};

export const typeaheadSelectedEvent = (
	pressed: boolean,
	duration: number,
	emoji: EmojiDescription,
	emojiList?: EmojiDescription[],
	query?: string,
	exactMatch?: boolean,
): AnalyticsEventPayload =>
	createEvent('ui', pressed ? 'pressed' : 'clicked', 'emojiTypeahead', undefined, {
		duration,
		position: getPosition(emojiList, emoji),
		...extractCommonAttributes(query, emojiList),
		...getSkinTone(emoji.id),
		emojiType: emoji.type,
		exactMatch: exactMatch || false,
	});
