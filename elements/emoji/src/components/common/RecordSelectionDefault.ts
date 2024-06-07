import type React from 'react';

import {
	type EmojiInsertionAnalytic,
	recordFailed,
	recordSucceeded,
	ufoExperiences,
} from '../../util/analytics';
import type { EmojiId, OnEmojiEvent, OptionalEmojiDescription } from '../../types';
import type { EmojiProvider } from '../../api/EmojiResource';
import { extractErrorInfo } from '../../util/analytics/analytics';

/**
 * A function that will wrap any configured Emoji 'onSelection' function to ensure recordSelection is always
 * called.
 *
 * @param provider the EmojiProvider which will be called on each emoji selection
 * @param onSelect the onSelect function that is explicitly configured on the Emoji component.
 * @param fireAnalytics a function used to fire analytics events.
 */
export const createRecordSelectionDefault = <T>(
	provider: EmojiProvider,
	onSelect?: OnEmojiEvent<T>,
	fireAnalytics?: (producer: EmojiInsertionAnalytic) => void,
): OnEmojiEvent<T> => {
	return (emojiId: EmojiId, emoji: OptionalEmojiDescription, event?: React.SyntheticEvent<T>) => {
		try {
			if (provider.recordSelection && emoji) {
				ufoExperiences['emoji-selection-recorded'].start();
				provider
					.recordSelection(emoji)
					.then(() => {
						fireAnalytics && fireAnalytics(recordSucceeded);
						ufoExperiences['emoji-selection-recorded'].success();
					})
					.catch((error) => {
						fireAnalytics && fireAnalytics(recordFailed);
						ufoExperiences['emoji-selection-recorded'].failure({
							metadata: {
								error: extractErrorInfo(error),
								reason: 'recordSelection error',
								source: 'RecordSelectionDefault',
								emojiId: emoji.id,
							},
						});
					});
			}
		} finally {
			if (onSelect) {
				onSelect(emojiId, emoji, event);
			}
		}
	};
};
