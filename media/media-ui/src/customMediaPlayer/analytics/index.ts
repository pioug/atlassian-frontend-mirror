export { createCustomMediaPlayerScreenEvent } from './events/screen/customMediaPlayer';
export { createMediaButtonClickedEvent } from './events/ui/mediaButtonClicked';
export { createPlaybackSpeedChangedEvent } from './events/ui/playbackSpeedChanged';
export { createPlayPauseBlanketClickedEvent } from './events/ui/playPauseBlanketClicked';
export { createMediaShortcutPressedEvent } from './events/ui/shortcutPressed';
export { createTimeRangeNavigatedEvent } from './events/ui/timeRangeNavigated';
export {
	createCaptionUploadSucceededEventPayload,
	createCaptionDeleteSucceededEventPayload,
	createCaptionDisplaySucceededEventPayload,
	createCaptionUploadFailedEventPayload,
	createCaptionDeleteFailedEventPayload,
	createCaptionDisplayFailedEventPayload,
} from './events/operational/captions';
export { createFirstPlayedTrackEvent } from './events/track/playCount';
export { createPlayedTrackEvent } from './events/track/played';

export type {
	CustomMediaPlayerUIEvent,
	CustomMediaPlayerUIEventPayload,
	CustomMediaPlayerAnalyticsEventPayload,
} from './utils/analytics';
export { createAndFireMediaCustomMediaPlayerEvent, fireAnalyticsEvent } from './utils/analytics';

export type {
	PlaybackAttributes,
	PlaybackState,
	WithPlaybackProps,
	WithMediaPlayerState,
} from './utils/playbackAttributes';
