import createAndFireEvent from '@atlaskit/analytics-next/createAndFireEvents';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types'; // eslint-disable-line @typescript-eslint/consistent-type-imports

import { type OptionalEmojiDescription, SearchSourceTypes } from '../../types';
import { recordSucceededEmoji } from './recordSucceededEmoji';

// it's used in editor typeahead to fire success record analytics
export const recordSelectionSucceededSli: any =
	(emoji: OptionalEmojiDescription, options?: { createAnalyticsEvent?: CreateUIAnalyticsEvent }) =>
	(): void => {
		if (options && options.createAnalyticsEvent) {
			createAndFireEvent('editor')(recordSucceededEmoji(emoji)(SearchSourceTypes.TYPEAHEAD))(
				options.createAnalyticsEvent,
			);
		}
	};
