import { type MediaFeatureFlags, type NumericalCardDimensions } from '@atlaskit/media-common';
import { type VideoTextTracks } from '../react-video-renderer';
import { type WithPlaybackProps } from '../analytics';
import { type TimeSaverConfig } from '../timeSaver';
import { type CustomMediaPlayerType } from '../types';
import { type WithShowControlMethodProp } from '../../types';
import { type FileIdentifier, type FileState } from '@atlaskit/media-client';
import { type MediaParsedSettings } from '@atlaskit/media-client-react';

export interface MediaPlayerProps extends WithPlaybackProps, WithShowControlMethodProp {
	readonly type: CustomMediaPlayerType;
	readonly src: string;
	readonly identifier: FileIdentifier;
	readonly isShortcutEnabled?: boolean;
	readonly lastWatchTimeConfig?: TimeSaverConfig;
	readonly onCanPlay?: () => void;
	readonly onPlay?: () => void;
	readonly onPause?: () => void;
	readonly onTimeChanged?: () => void;
	readonly onError?: () => void;
	readonly onDownloadClick?: () => void;
	readonly onFirstPlay?: () => void;
	readonly onFullscreenChange?: (fullscreen: boolean) => void;
	readonly originalDimensions?: NumericalCardDimensions;
	readonly featureFlags?: MediaFeatureFlags;
	readonly poster?: string;
	readonly videoControlsWrapperRef?: React.Ref<HTMLDivElement>;
	readonly areControlsVisible?: boolean;
}

export interface MediaPlayerBaseProps extends MediaPlayerProps {
	readonly textTracks?: VideoTextTracks;
	readonly mediaSettings?: MediaParsedSettings;
	readonly fileState?: FileState;
	readonly areCaptionsEnabled: boolean;
	readonly onTextTracksSelected?: (selectedTracksIndex: number) => void;
	readonly onCaptionsEnabledChange?: (areCaptionsEnabled: boolean) => void;
}
