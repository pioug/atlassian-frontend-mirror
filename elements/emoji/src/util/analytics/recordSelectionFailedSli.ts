import createAndFireEvent from '@atlaskit/analytics-next/createAndFireEvents';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types'; // eslint-disable-line @typescript-eslint/consistent-type-imports

import { type OptionalEmojiDescription, SearchSourceTypes } from '../../types';
import { recordFailedEmoji } from './recordFailedEmoji';

// it's used in editor typeahead to fire failure record analytics
export const recordSelectionFailedSli: any =
	(emoji: OptionalEmojiDescription, options?: { createAnalyticsEvent?: CreateUIAnalyticsEvent }) =>
	(err: Error): Promise<never> => {
		if (options && options.createAnalyticsEvent) {
			createAndFireEvent('editor')(recordFailedEmoji(emoji)(SearchSourceTypes.TYPEAHEAD))(
				options.createAnalyticsEvent,
			);
		}
		return Promise.reject(err);
	};
