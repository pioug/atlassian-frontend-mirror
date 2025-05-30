/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
// Keep media player components used in media-viewer to use static colors from the new color palette to
// support the hybrid theming in media viewer https://product-fabric.atlassian.net/browse/DSP-6067
import React from 'react';
import { Component } from 'react';
import { type WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import PlayIcon from '@atlaskit/icon/core/migration/video-play--vid-play';
import PauseIcon from '@atlaskit/icon/core/migration/video-pause--vid-pause';
import FullScreenIconOn from '@atlaskit/icon/core/migration/fullscreen-enter--vid-full-screen-on';
import FullScreenIconOff from '@atlaskit/icon/core/migration/shrink-diagonal--vid-full-screen-off';
import SoundIcon from '@atlaskit/icon/core/migration/volume-high--hipchat-outgoing-sound';
import VideoHdIcon from '@atlaskit/icon-lab/core/video-hd';
import VideoHdFilledIcon from '@atlaskit/icon-lab/core/video-hd-filled';
import DownloadIcon from '@atlaskit/icon/core/migration/download';
import { type MediaFeatureFlags, type NumericalCardDimensions } from '@atlaskit/media-common';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { injectIntl } from 'react-intl-next';
import { Box, Flex } from '@atlaskit/primitives/compiled';
import { cssMap } from '@atlaskit/css';
import MediaButton from '../../MediaButton';
import Spinner from '@atlaskit/spinner';
import { WidthObserver } from '@atlaskit/width-detector';
import MediaPlayer, {
	type VideoState,
	type VideoActions,
	type VideoTextTracks,
	type VideoTextTrack,
} from '../react-video-renderer';
import { TimeRange } from '../timeRange';
import VolumeRange from '../volumeRange';
import {
	CurrentTime,
	VolumeWrapper,
	LeftControls,
	RightControls,
	VolumeToggleWrapper,
	MutedIndicator,
	VolumeTimeRangeWrapper,
} from '../styled';
import { ControlsWrapper } from '../styled-compiled';
import {
	type CustomMediaPlayerUIEvent,
	type CustomMediaPlayerAnalyticsEventPayload,
	fireAnalyticsEvent,
	createCustomMediaPlayerScreenEvent,
	createMediaButtonClickedEvent,
	createMediaShortcutPressedEvent,
	createPlayPauseBlanketClickedEvent,
	createTimeRangeNavigatedEvent,
	createPlaybackSpeedChangedEvent,
	createFirstPlayedTrackEvent,
	createPlayedTrackEvent,
	type PlaybackState,
	type WithMediaPlayerState,
	type WithPlaybackProps,
} from '../analytics';
import { formatDuration } from '../../formatDuration';
import { Shortcut, keyCodes } from '../../shortcut';
import { toggleFullscreen, getFullscreenElement } from '../fullscreen';
import { type WrappedComponentProps } from 'react-intl-next';
import { messages } from '../../messages';
import simultaneousPlayManager from '../simultaneousPlayManager';
import { TimeSaver, type TimeSaverConfig } from '../timeSaver';
import PlaybackSpeedControls from '../playbackSpeedControls';
import { CaptionsSelectControls } from './captionsSelectControls';
import { CaptionsAdminControls } from './captionsAdminControls';
import { PlayPauseBlanket } from '../playPauseBlanket';
import Tooltip from '@atlaskit/tooltip';
import { SkipTenBackwardIcon, SkipTenForwardIcon } from '@atlaskit/legacy-custom-icons';
import { fg } from '@atlaskit/platform-feature-flags';
import VideoSkipForwardTenIcon from '@atlaskit/icon/core/video-skip-forward-ten';
import VideoSkipBackwardTenIcon from '@atlaskit/icon/core/video-skip-backward-ten';
import { token } from '@atlaskit/tokens';
import { type CustomMediaPlayerType } from '../types';
import { type WithShowControlMethodProp } from '../../types';
import { type FileIdentifier } from '@atlaskit/media-client';
import { type MediaParsedSettings } from '@atlaskit/media-client-react';
import {
	getUserCaptionsLocale,
	setUserCaptionsLocale,
	findPreselectedTrackIndex,
	getUserCaptionsEnabled,
	setUserCaptionsEnabled,
} from './captions';
import { CaptionsUploaderBrowser } from './captions/artifactUploader';

export interface MediaPlayerBaseProps extends WithPlaybackProps, WithShowControlMethodProp {
	readonly type: CustomMediaPlayerType;
	readonly src: string;
	readonly identifier: FileIdentifier;
	readonly onHDToggleClick?: () => void;
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
	readonly textTracks?: VideoTextTracks;
	readonly areControlsVisible?: boolean;
	readonly mediaSettings?: MediaParsedSettings;
}

export interface CustomMediaPlayerState extends WithMediaPlayerState {
	selectedTracksIndex: number;
	areCaptionsEnabled?: boolean;
	isArtifactUploaderOpen: boolean;
}

export type Action = () => void;

const MEDIUM_VIDEO_MAX_WIDTH = 400;
const SMALL_VIDEO_MAX_WIDTH = 245;
const MINIMUM_DURATION_BEFORE_SAVING_TIME = 60;
const VIEWED_TRACKING_SECS = 2;

/* Styles */

const timebarWrapperStyles = cssMap({
	root: {
		position: 'absolute',
		width: '100%',
		bottom: token('space.100'),
	},
});

const customVideoWrapperStyles = cssMap({
	root: {
		width: '100%',
		height: '100%',
		userSelect: 'none',
	},
});

const videoWrapperStyles = cssMap({
	root: {
		width: '100%',
		height: '100%',
	},
});

const timeWrapperStyles = cssMap({
	root: {
		marginTop: token('space.0'),
		marginInline: token('space.250'),
		marginBottom: token('space.500'),
	},
});

const spinnerWrapperStyles = cssMap({
	root: {
		position: 'absolute',
		top: token('space.0'),
		left: token('space.0'),
		width: '100%',
		height: '100%',
	},
});

type MediaPlayerBaseOwnProps = MediaPlayerBaseProps &
	WrappedComponentProps &
	WithAnalyticsEventsProps;

class _MediaPlayerBase extends Component<MediaPlayerBaseOwnProps, CustomMediaPlayerState> {
	videoWrapperRef = React.createRef<HTMLDivElement>();

	private actions?: VideoActions;
	private videoState: Partial<VideoState> = {
		isLoading: true,
		buffered: 0,
		currentTime: 0,
		volume: 1,
		status: 'paused',
		duration: 0,
		isMuted: false,
	};
	private wasPlayedOnce: boolean = false;
	private lastCurrentTime = 0;
	private readonly timeSaver = new TimeSaver(this.props.lastWatchTimeConfig);
	private clickToTogglePlayTimeoutId: ReturnType<typeof setTimeout> | undefined;

	state: CustomMediaPlayerState = {
		isFullScreenEnabled: false,
		playerSize: 'large',
		playbackSpeed: 1,
		selectedTracksIndex: -1,
		areCaptionsEnabled: false,
		isArtifactUploaderOpen: false,
	};

	constructor(props: MediaPlayerBaseProps & WrappedComponentProps & WithAnalyticsEventsProps) {
		super(props);
		this.state.selectedTracksIndex = this.findPreselectedTrackIndex(this.props);

		if (this.mediaUserPreferences) {
			const userCaptionsEnabled = getUserCaptionsEnabled(this.mediaUserPreferences);
			this.state.areCaptionsEnabled = userCaptionsEnabled;
		}
	}

	componentDidUpdate(prevProps: MediaPlayerBaseOwnProps, prevState: CustomMediaPlayerState): void {
		const { intl, textTracks } = this.props;
		const { intl: prevIntl, textTracks: prevTextTracks } = prevProps;
		const didLocaleChange = prevIntl.locale !== intl.locale;
		const didTextTracksChange = prevTextTracks?.captions?.tracks !== textTracks?.captions?.tracks;

		if (didLocaleChange || didTextTracksChange) {
			this.setState({ selectedTracksIndex: this.findPreselectedTrackIndex(this.props) });
		}

		if (
			this.mediaUserPreferences &&
			prevState.areCaptionsEnabled !== this.state.areCaptionsEnabled
		) {
			setUserCaptionsEnabled(this.mediaUserPreferences, !!this.state.areCaptionsEnabled);
		}
	}

	findPreselectedTrackIndex = ({ textTracks, intl }: MediaPlayerBaseOwnProps) => {
		return findPreselectedTrackIndex(
			textTracks?.captions?.tracks || [],
			intl.locale,
			this.getUserCaptionsPreference(),
		);
	};

	get mediaUserPreferences() {
		const { mediaSettings: { mediaUserPreferences = undefined } = {} } = this.props;
		return mediaUserPreferences;
	}

	getUserCaptionsPreference = () => {
		return this.mediaUserPreferences && getUserCaptionsLocale(this.mediaUserPreferences);
	};
	setUserCaptionsPreference = (selectedTracks: VideoTextTrack) => {
		if (this.mediaUserPreferences) {
			setUserCaptionsLocale(this.mediaUserPreferences, selectedTracks.lang);
		}
	};

	componentDidMount() {
		const {
			type,
			identifier,
			isAutoPlay,
			isHDAvailable,
			isHDActive,
			onFirstPlay,
			createAnalyticsEvent,
		} = this.props;
		const { isFullScreenEnabled, playerSize, playbackSpeed } = this.state;

		fireAnalyticsEvent(
			createCustomMediaPlayerScreenEvent(
				type,
				{
					isAutoPlay,
					isHDAvailable,
					isHDActive,
					isFullScreenEnabled,
					playerSize,
					playbackSpeed,
				},
				identifier.id,
			),
			createAnalyticsEvent,
		);

		if (this.videoWrapperRef.current) {
			this.videoWrapperRef.current.addEventListener('fullscreenchange', this.onFullScreenChange);
		}

		simultaneousPlayManager.subscribe(this);

		if (isAutoPlay) {
			simultaneousPlayManager.pauseOthers(this);
			if (onFirstPlay) {
				this.fireFirstPlayedTrackEvent();
				this.wasPlayedOnce = true;
				onFirstPlay();
			}
			this.props.onPlay?.();
		}
	}

	private fireFirstPlayedTrackEvent = () => {
		const { type, identifier, isHDActive, isHDAvailable, isAutoPlay, createAnalyticsEvent } =
			this.props;
		const { isFullScreenEnabled, playerSize, playbackSpeed } = this.state;

		fireAnalyticsEvent(
			createFirstPlayedTrackEvent(
				type,
				{
					isAutoPlay,
					isHDAvailable,
					isHDActive,
					isFullScreenEnabled,
					playerSize,
					playbackSpeed,
				},
				identifier.id,
			),
			createAnalyticsEvent,
		);
	};

	componentWillUnmount() {
		if (this.videoWrapperRef.current) {
			this.videoWrapperRef.current.removeEventListener('fullscreenchange', this.onFullScreenChange);
		}
		if (this.state.isFullScreenEnabled) {
			this.props.onFullscreenChange?.(false);
		}

		simultaneousPlayManager.unsubscribe(this);
	}

	private onFullScreenChange = (e: Event) => {
		if (e.target !== this.videoWrapperRef.current) {
			return;
		}
		const { isFullScreenEnabled: currentFullScreenMode } = this.state;
		const isFullScreenEnabled = !!getFullscreenElement();

		if (currentFullScreenMode !== isFullScreenEnabled) {
			this.props.onFullscreenChange?.(isFullScreenEnabled);
			this.setState({
				isFullScreenEnabled,
			});
		}
	};

	private onTimeChanged = () => {
		this.createAndFireUIEvent('timeRangeNavigate', 'time');
		this.props.onTimeChanged?.();
	};

	private onVolumeChanged = () => {
		this.createAndFireUIEvent('volumeRangeNavigate', 'volume');
	};

	private getDefaultTime = () => {
		return this.timeSaver.defaultTime;
	};

	private onCurrentTimeChange = (currentTime: number, duration: number) => {
		// We rely on the saved time when switching to the new source URL
		// so we need to save it irrespective of elapsed time or video length
		if (fg('platform_media_resume_video_on_token_expiry')) {
			this.timeSaver.defaultTime = currentTime;
		} else if (duration - currentTime > MINIMUM_DURATION_BEFORE_SAVING_TIME) {
			this.timeSaver.defaultTime = currentTime;
		} else {
			this.timeSaver.defaultTime = 0;
		}
	};

	private renderCurrentTime = ({ currentTime, duration }: VideoState) => (
		<CurrentTime draggable={false}>
			{formatDuration(currentTime)} / {formatDuration(duration)}
		</CurrentTime>
	);

	private renderHDButton = () => {
		const { type, isHDAvailable, isHDActive, onHDToggleClick } = this.props;

		if (type === 'audio' || !isHDAvailable) {
			return;
		}

		return (
			<MediaButton
				testId="custom-media-player-hd-button"
				onClick={
					!!onHDToggleClick
						? this.getMediaButtonClickHandler(onHDToggleClick, 'HDButton')
						: undefined
				}
				iconBefore={
					isHDActive ? <VideoHdFilledIcon label="hd active" /> : <VideoHdIcon label="hd" />
				}
			/>
		);
	};

	private onPlaybackSpeedChange = (playbackSpeed: number) => {
		if (!this.actions) {
			return;
		}

		this.actions.setPlaybackSpeed(playbackSpeed);
		this.setState({ playbackSpeed });

		this.createAndFireUIEvent('playbackSpeedChange');
	};

	private renderSpeedControls = () => {
		const { playbackSpeed } = this.state;
		const { originalDimensions } = this.props;

		return (
			<PlaybackSpeedControls
				originalDimensions={originalDimensions}
				playbackSpeed={playbackSpeed}
				onPlaybackSpeedChange={this.onPlaybackSpeedChange}
				onClick={() => this.createAndFireUIEvent('mediaButtonClick', 'playbackSpeedButton')}
			/>
		);
	};

	private renderVolume = (videoState: VideoState, actions: VideoActions, showSlider: boolean) => (
		<VolumeWrapper showSlider={showSlider}>
			<VolumeToggleWrapper isMuted={videoState.isMuted}>
				<MutedIndicator isMuted={videoState.isMuted} />
				<MediaButton
					testId="custom-media-player-volume-toggle-button"
					onClick={this.getMediaButtonClickHandler(actions.toggleMute, 'muteButton')}
					iconBefore={
						<SoundIcon
							color="currentColor"
							label={this.props.intl.formatMessage(messages.volumeMuteButtonAria)}
						/>
					}
					aria-pressed={videoState.isMuted}
				/>
			</VolumeToggleWrapper>
			{showSlider && (
				<VolumeTimeRangeWrapper>
					<VolumeRange
						onChange={actions.setVolume}
						currentVolume={videoState.volume}
						isAlwaysActive={true}
						onChanged={this.onVolumeChanged}
						ariaLabel={this.props.intl.formatMessage(messages.volumeLevelControlAria)}
					/>
				</VolumeTimeRangeWrapper>
			)}
		</VolumeWrapper>
	);

	private toggleFullscreen = () =>
		this.videoWrapperRef.current && toggleFullscreen(this.videoWrapperRef.current);

	private onFullScreenButtonClick = () => {
		this.toggleFullscreen();
		this.createAndFireUIEvent('mediaButtonClick', 'fullScreenButton');
	};

	private onResize = (width: number) => {
		if (width > MEDIUM_VIDEO_MAX_WIDTH) {
			this.setState({
				playerSize: 'large',
			});
		} else if (width > SMALL_VIDEO_MAX_WIDTH) {
			this.setState({
				playerSize: 'medium',
			});
		} else {
			this.setState({
				playerSize: 'small',
			});
		}
	};

	private renderFullScreenButton = () => {
		const {
			intl: { formatMessage },
			type,
		} = this.props;

		if (type === 'audio') {
			return;
		}

		const { isFullScreenEnabled } = this.state;
		const icon = isFullScreenEnabled ? (
			<FullScreenIconOff color="currentColor" label={formatMessage(messages.disable_fullscreen)} />
		) : (
			<FullScreenIconOn color="currentColor" label={formatMessage(messages.enable_fullscreen)} />
		);

		return (
			<MediaButton
				testId="custom-media-player-fullscreen-button"
				onClick={this.onFullScreenButtonClick}
				iconBefore={icon}
			/>
		);
	};

	private renderDownloadButton = () => {
		const { onDownloadClick } = this.props;
		if (!onDownloadClick) {
			return;
		}

		return (
			<MediaButton
				testId="custom-media-player-download-button"
				onClick={this.getMediaButtonClickHandler(onDownloadClick, 'downloadButton')}
				iconBefore={<DownloadIcon color="currentColor" label="download" />}
			/>
		);
	};

	private renderShortcuts = ({
		togglePlayPauseAction,
		toggleMute,
		skipBackward,
		skipForward,
	}: {
		togglePlayPauseAction: Action;
		toggleMute: Action;
		skipBackward: Action;
		skipForward: Action;
	}) => {
		const { isShortcutEnabled } = this.props;
		const { isFullScreenEnabled } = this.state;

		const shortcuts = (isShortcutEnabled || isFullScreenEnabled) && [
			<Shortcut
				key="space-shortcut"
				code={keyCodes.space}
				handler={this.getKeyboardShortcutHandler(togglePlayPauseAction, 'space')}
			/>,

			<Shortcut
				key="m-shortcut"
				code={keyCodes.m}
				handler={this.getKeyboardShortcutHandler(toggleMute, 'mute')}
			/>,
		];

		if (shortcuts && isFullScreenEnabled) {
			// Fullscreen shortcuts only. We don't want to override left/right keys in media-viewer settings
			shortcuts.push(
				<Shortcut
					key="skip-backward-shortcut"
					code={keyCodes.leftArrow}
					handler={this.getKeyboardShortcutHandler(skipBackward, 'leftArrow')}
				/>,
			);
			shortcuts.push(
				<Shortcut
					key="skip-forward-shortcut"
					code={keyCodes.rightArrow}
					handler={this.getKeyboardShortcutHandler(skipForward, 'rightArrow')}
				/>,
			);
		}

		return shortcuts;
	};

	private renderPlayPauseButton = (isPlaying: boolean) => {
		const {
			intl: { formatMessage },
		} = this.props;

		const toggleButtonIcon = isPlaying ? (
			<PauseIcon spacing="spacious" color="currentColor" label={formatMessage(messages.pause)} />
		) : (
			<PlayIcon spacing="spacious" color="currentColor" label={formatMessage(messages.play)} />
		);

		return (
			<Tooltip content={formatMessage(isPlaying ? messages.pause : messages.play)} position="top">
				<MediaButton
					testId="custom-media-player-play-toggle-button"
					data-test-is-playing={isPlaying}
					iconBefore={toggleButtonIcon}
					onClick={isPlaying ? this.pausePlayByButtonClick : this.startPlayByButtonClick}
				/>
			</Tooltip>
		);
	};

	private renderSkipBackwardButton = (skipBackward: Action) => {
		const {
			intl: { formatMessage },
		} = this.props;

		return (
			<Tooltip content={formatMessage(messages.skipBackward)} position="top">
				<MediaButton
					testId="custom-media-player-skip-backward-button"
					iconBefore={
						<VideoSkipBackwardTenIcon
							spacing="spacious"
							LEGACY_fallbackIcon={SkipTenBackwardIcon}
							label={formatMessage(messages.skipBackward)}
						/>
					}
					onClick={this.getMediaButtonClickHandler(skipBackward, 'skipBackwardButton')}
				/>
			</Tooltip>
		);
	};

	private renderSkipForwardButton = (skipForward: Action) => {
		const {
			intl: { formatMessage },
		} = this.props;

		return (
			<Tooltip content={formatMessage(messages.skipForward)} position="top">
				<MediaButton
					testId="custom-media-player-skip-forward-button"
					iconBefore={
						<VideoSkipForwardTenIcon
							spacing="spacious"
							LEGACY_fallbackIcon={SkipTenForwardIcon}
							label={formatMessage(messages.skipForward)}
						/>
					}
					onClick={this.getMediaButtonClickHandler(skipForward, 'skipForwardButton')}
				/>
			</Tooltip>
		);
	};

	private renderSpinner = () => (
		<Flex
			direction="column"
			alignItems="center"
			justifyContent="center"
			xcss={spinnerWrapperStyles.root}
		>
			<Spinner appearance="invert" size="large" />
		</Flex>
	);

	private setActions(actions: VideoActions) {
		// Actions are being sent constantly while the video is playing,
		// though play and pause functions are always the same objects
		if (!this.actions) {
			this.actions = actions;
		}
	}

	public pause = () => {
		if (this.actions) {
			this.actions.pause();
		}
		this.props.onPause?.();
	};

	private play = () => {
		const { onFirstPlay } = this.props;
		if (this.actions) {
			this.actions.play();
		}
		simultaneousPlayManager.pauseOthers(this);
		if (!this.wasPlayedOnce && onFirstPlay) {
			this.fireFirstPlayedTrackEvent();
			this.wasPlayedOnce = true;
			onFirstPlay();
		}
		if (this.mediaUserPreferences) {
			const userCaptionsEnabled = getUserCaptionsEnabled(this.mediaUserPreferences);
			this.setState({ areCaptionsEnabled: userCaptionsEnabled });
		}
	};

	private getMediaButtonClickHandler = (action: Action, buttonType: string) => () => {
		action();
		this.createAndFireUIEvent('mediaButtonClick', buttonType);
	};

	private getKeyboardShortcutHandler = (action: Action, shortcutType: string) => () => {
		const { showControls } = this.props;
		action();

		if (showControls) {
			showControls();
		}

		this.createAndFireUIEvent('shortcutPress', shortcutType);
	};

	private createAndFireUIEvent(eventType: CustomMediaPlayerUIEvent, actionSubjectId?: string) {
		const { type, identifier, isHDActive, isHDAvailable, isAutoPlay, createAnalyticsEvent } =
			this.props;
		const { isFullScreenEnabled, playerSize, playbackSpeed } = this.state;
		const playbackState: PlaybackState = {
			...this.videoState,
			isAutoPlay,
			isHDAvailable,
			isHDActive,
			isFullScreenEnabled,
			playerSize,
			playbackSpeed,
		};

		let analyticsEvent: CustomMediaPlayerAnalyticsEventPayload;

		switch (eventType) {
			case 'mediaButtonClick':
				analyticsEvent = createMediaButtonClickedEvent(
					type,
					playbackState,
					actionSubjectId,
					identifier.id,
				);
				break;
			case 'shortcutPress':
				analyticsEvent = createMediaShortcutPressedEvent(
					type,
					playbackState,
					actionSubjectId,
					identifier.id,
				);
				break;
			case 'playPauseBlanketClick':
				analyticsEvent = createPlayPauseBlanketClickedEvent(type, playbackState, identifier.id);
				break;
			case 'timeRangeNavigate':
			case 'volumeRangeNavigate':
				analyticsEvent = createTimeRangeNavigatedEvent(
					type,
					playbackState,
					actionSubjectId,
					identifier.id,
				);
				break;
			case 'playbackSpeedChange':
				analyticsEvent = createPlaybackSpeedChangedEvent(type, playbackState, identifier.id);
				break;
			default:
				analyticsEvent = {
					eventType: 'ui',
					action: 'default',
					actionSubject: 'customMediaPlayer',
					attributes: {
						type,
					},
				};
		}

		fireAnalyticsEvent(analyticsEvent, createAnalyticsEvent);
	}

	private onViewed = (videoState: VideoState) => {
		const { createAnalyticsEvent, identifier, isAutoPlay, isHDAvailable, isHDActive, type } =
			this.props;
		const { isFullScreenEnabled, playerSize, playbackSpeed } = this.state;
		const { status, currentTime } = videoState;

		if (
			status === 'playing' &&
			(currentTime < this.lastCurrentTime ||
				currentTime >= this.lastCurrentTime + VIEWED_TRACKING_SECS)
		) {
			fireAnalyticsEvent(
				createPlayedTrackEvent(
					type,
					{
						...videoState,
						isAutoPlay,
						isHDAvailable,
						isHDActive,
						isFullScreenEnabled,
						playerSize,
						playbackSpeed,
					},
					identifier.id,
				),
				createAnalyticsEvent,
			);
			this.lastCurrentTime = currentTime;
		}
	};

	private resetPendingPlayPauseToggleTimer = () => {
		if (this.clickToTogglePlayTimeoutId !== undefined) {
			clearTimeout(this.clickToTogglePlayTimeoutId);
		}
	};

	private doubleClickToFullscreen = () => {
		this.resetPendingPlayPauseToggleTimer();
		this.toggleFullscreen();
		// TODO Add an event similar to "playPauseBlanketClick" but for fullscreen trigger
	};

	private togglePlayByBlanketClick = (action: () => void) => {
		this.resetPendingPlayPauseToggleTimer();
		this.clickToTogglePlayTimeoutId = setTimeout(() => {
			action();
			this.createAndFireUIEvent('playPauseBlanketClick');
		}, 200);
	};

	private startPlayByBlanketClick = () => {
		this.togglePlayByBlanketClick(this.play);
	};

	private pausePlayByBlanketClick = () => {
		this.togglePlayByBlanketClick(this.pause);
	};

	private startPlayByButtonClick = this.getMediaButtonClickHandler(this.play, 'playButton');
	private pausePlayByButtonClick = this.getMediaButtonClickHandler(this.pause, 'pauseButton');

	private onTextTracksSelected = (selectedTracksIndex: number) => {
		const selectedTracks = this.props.textTracks?.captions?.tracks[selectedTracksIndex];
		!!selectedTracks && this.setUserCaptionsPreference(selectedTracks);
		this.setState({ selectedTracksIndex });
	};

	private onCaptionsEnabledChange = (areCaptionsEnabled: boolean) => {
		this.setState({ areCaptionsEnabled });
	};

	resolveSelectedTracksIndex = () => {
		const { areCaptionsEnabled, selectedTracksIndex } = this.state;
		return areCaptionsEnabled ? (selectedTracksIndex > -1 ? selectedTracksIndex : 0) : -1;
	};

	resolveTextTracks = (): VideoTextTracks | undefined => {
		const { areCaptionsEnabled } = this.state;
		const { textTracks } = this.props;
		const tracksKey = 'captions';
		if (areCaptionsEnabled && textTracks?.[tracksKey]) {
			return {
				...textTracks,
				[tracksKey]: {
					...textTracks[tracksKey],
					selectedTrackIndex: this.resolveSelectedTracksIndex(),
				},
			};
		}
		return undefined;
	};

	render() {
		const {
			type,
			src,
			isAutoPlay,
			onCanPlay,
			onError,
			poster,
			videoControlsWrapperRef,
			textTracks,
			areControlsVisible,
			identifier,
			mediaSettings: { canUpdateVideoCaptions = false } = {},
		} = this.props;

		const { areCaptionsEnabled, isArtifactUploaderOpen } = this.state;

		return (
			<Box
				xcss={customVideoWrapperStyles.root}
				ref={this.videoWrapperRef}
				testId="custom-media-player"
			>
				<MediaPlayer
					sourceType={type}
					src={src}
					autoPlay={isAutoPlay}
					onCanPlay={onCanPlay}
					defaultTime={this.getDefaultTime}
					onTimeChange={this.onCurrentTimeChange}
					onError={onError}
					poster={poster}
					textTracks={this.resolveTextTracks()}
					textTracksPosition={areControlsVisible ? -3.7 : undefined}
				>
					{(video, videoState, actions) => {
						this.onViewed(videoState);
						this.setActions(actions);
						//Video State(either prop or variable) is ReadOnly
						this.videoState = videoState;
						const { status, currentTime, buffered, duration, isLoading } = videoState;
						const { playerSize } = this.state;
						const isPlaying = status === 'playing';

						const isLargePlayer = playerSize === 'large';
						const isMediumPlayer = playerSize === 'medium';

						const defaultSkipAmount = 10;
						const skipBackward = (skipAmount = defaultSkipAmount) => {
							const newTime = videoState.currentTime - skipAmount;
							actions.navigate(Math.max(newTime, 0));
							this.props.onTimeChanged?.();
						};

						const skipForward = (skipAmount = defaultSkipAmount) => {
							const newTime = videoState.currentTime + skipAmount;
							actions.navigate(Math.min(newTime, videoState.duration));
							this.props.onTimeChanged?.();
						};

						const shortcuts = this.renderShortcuts({
							togglePlayPauseAction: isPlaying ? this.pause : this.play,
							toggleMute: actions.toggleMute,
							skipBackward,
							skipForward,
						});
						return (
							<Flex direction="column" xcss={videoWrapperStyles.root}>
								<WidthObserver setWidth={this.onResize} />
								{shortcuts}
								{isLoading && this.renderSpinner()}
								<PlayPauseBlanket
									onDoubleClick={this.doubleClickToFullscreen}
									onClick={isPlaying ? this.pausePlayByBlanketClick : this.startPlayByBlanketClick}
									data-testid="play-pause-blanket"
								>
									{video}
								</PlayPauseBlanket>
								<ControlsWrapper ref={videoControlsWrapperRef} controlsHidden={this.wasPlayedOnce}>
									<Box xcss={timeWrapperStyles.root}>
										<TimeRange
											currentTime={currentTime}
											bufferedTime={buffered}
											duration={duration}
											onChange={actions.navigate}
											onChanged={this.onTimeChanged}
											disableThumbTooltip={true}
											skipBackward={skipBackward}
											skipForward={skipForward}
											isAlwaysActive={false}
										/>
									</Box>
									<Flex
										alignItems="center"
										justifyContent="space-between"
										xcss={timebarWrapperStyles.root}
									>
										<LeftControls>
											{this.renderPlayPauseButton(isPlaying)}
											{isLargePlayer && this.renderSkipBackwardButton(skipBackward)}
											{isLargePlayer && this.renderSkipForwardButton(skipForward)}
											{this.renderVolume(videoState, actions, isLargePlayer)}
										</LeftControls>
										<RightControls>
											{(isMediumPlayer || isLargePlayer) && this.renderCurrentTime(videoState)}
											{isLargePlayer &&
												!fg('platform_media_disable_video_640p_artifact_usage') &&
												this.renderHDButton()}
											{isLargePlayer && this.renderSpeedControls()}
											{textTracks && (
												<CaptionsSelectControls
													textTracks={textTracks}
													onSelected={this.onTextTracksSelected}
													areCaptionsEnabled={!!areCaptionsEnabled}
													onCaptionsEnabledChange={this.onCaptionsEnabledChange}
													selectedTracksIndex={this.resolveSelectedTracksIndex()}
												/>
											)}
											{this.renderFullScreenButton()}
											{isLargePlayer && this.renderDownloadButton()}
											{isMediumPlayer ||
												(isLargePlayer && canUpdateVideoCaptions && (
													<>
														<CaptionsAdminControls
															textTracks={textTracks}
															onUpload={() => this.setState({ isArtifactUploaderOpen: true })}
														/>
														<CaptionsUploaderBrowser
															identifier={identifier}
															isOpen={isArtifactUploaderOpen}
															onClose={() => this.setState({ isArtifactUploaderOpen: false })}
															onStart={() => {
																// console.log('xxx onStart', file);
															}}
															onEnd={() => {
																// console.log('xxx onEnd', result);
															}}
															onError={() => {
																// console.log('xxx onError', error);
															}}
														/>
													</>
												))}
										</RightControls>
									</Flex>
								</ControlsWrapper>
							</Flex>
						);
					}}
				</MediaPlayer>
			</Box>
		);
	}
}

export const MediaPlayerBase = withAnalyticsEvents()(injectIntl(_MediaPlayerBase));
