import { type CreateUIAnalyticsEvent, createAndFireEvent } from '@atlaskit/analytics-next';

import {
	ANALYTICS_MEDIA_CHANNEL,
	type UIAttributes,
	type UIEventPayload,
} from '@atlaskit/media-common';

import { type CustomMediaPlayerScreenEventPayload } from '../events/screen/customMediaPlayer';
import { type MediaButtonClickEventPayload } from '../events/ui/mediaButtonClicked';
import { type PlaybackSpeedChangeEventPayload } from '../events/ui/playbackSpeedChanged';
import { type PlayPauseBlanketClickEventPayload } from '../events/ui/playPauseBlanketClicked';
import { type ShortcutPressEventPayload } from '../events/ui/shortcutPressed';
import { type TimeRangeNavigateEventPayload } from '../events/ui/timeRangeNavigated';
import {
	type CaptionSucceededEventPayload,
	type CaptionFailedEventPayload,
} from '../events/operational/captions';
import { type FirstPlayedTrackEventPayload } from '../events/track/playCount';
import { type PlayedTrackEventPayload } from '../events/track/played';
import { type CustomMediaPlayerType } from '../../types';

export type CustomMediaPlayerUIEventPayload = UIEventPayload<
	UIAttributes & {
		type: CustomMediaPlayerType;
	},
	'default',
	'customMediaPlayer'
>;

export type CustomMediaPlayerUIEvent =
	| 'mediaButtonClick'
	| 'shortcutPress'
	| 'playPauseBlanketClick'
	| 'timeRangeNavigate'
	| 'volumeRangeNavigate'
	| 'playbackSpeedChange';

export type CustomMediaPlayerAnalyticsEventPayload =
	| CustomMediaPlayerScreenEventPayload
	| MediaButtonClickEventPayload
	| PlaybackSpeedChangeEventPayload
	| PlayPauseBlanketClickEventPayload
	| ShortcutPressEventPayload
	| TimeRangeNavigateEventPayload
	| CaptionSucceededEventPayload
	| CaptionFailedEventPayload
	| CustomMediaPlayerUIEventPayload
	| FirstPlayedTrackEventPayload
	| PlayedTrackEventPayload;

// can be called in a component whose props extend WithAnalyticsEventsProps
export function fireAnalyticsEvent(
	payload: CustomMediaPlayerAnalyticsEventPayload,
	createAnalyticsEvent?: CreateUIAnalyticsEvent,
) {
	if (createAnalyticsEvent) {
		const event = createAnalyticsEvent(payload);
		event.fire(ANALYTICS_MEDIA_CHANNEL);
	}
}

// can be used inside withAnalyticsEvents() hook
export const createAndFireMediaCustomMediaPlayerEvent = (
	payload: CustomMediaPlayerAnalyticsEventPayload,
) => {
	return createAndFireEvent(ANALYTICS_MEDIA_CHANNEL)(payload);
};
