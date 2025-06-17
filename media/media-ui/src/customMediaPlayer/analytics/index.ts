export { createCustomMediaPlayerScreenEvent } from './events/screen/customMediaPlayer';
export { createMediaButtonClickedEvent } from './events/ui/mediaButtonClicked';
export { createPlaybackSpeedChangedEvent } from './events/ui/playbackSpeedChanged';
export { createPlayPauseBlanketClickedEvent } from './events/ui/playPauseBlanketClicked';
export { createMediaShortcutPressedEvent } from './events/ui/shortcutPressed';
export { createTimeRangeNavigatedEvent } from './events/ui/timeRangeNavigated';
export { createCaptionUploadSucceededOperationalEvent } from './events/operational/captionUploadSucceeded';
export { createCaptionDeleteSucceededOperationalEvent } from './events/operational/captionDeleteSucceeded';
export { createCaptionUploadFailedOperationalEvent } from './events/operational/captionUploadFailed';
export { createCaptionDeleteFailedOperationalEvent } from './events/operational/captionDeleteFailed';
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
