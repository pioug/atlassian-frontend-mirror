import { type UIAttributes, type UIEventPayload } from '@atlaskit/media-common';

import { type CustomMediaPlayerType } from '../../types';
import {
	type CaptionSucceededEventPayload,
	type CaptionFailedEventPayload,
} from '../events/operational/captions';
import { type CustomMediaPlayerScreenEventPayload } from '../events/screen/customMediaPlayer';
import { type FirstPlayedTrackEventPayload } from '../events/track/playCount';
import { type PlayedTrackEventPayload } from '../events/track/played';
import { type MediaButtonClickEventPayload } from '../events/ui/mediaButtonClicked';
import { type PlaybackSpeedChangeEventPayload } from '../events/ui/playbackSpeedChanged';
import { type PlayPauseBlanketClickEventPayload } from '../events/ui/playPauseBlanketClicked';
import { type ShortcutPressEventPayload } from '../events/ui/shortcutPressed';
import { type TimeRangeNavigateEventPayload } from '../events/ui/timeRangeNavigated';

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
