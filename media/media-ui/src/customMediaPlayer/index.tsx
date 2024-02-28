/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
// Keep media player components used in media-viewer to use static colors from the new color palette to
// support the hybrid theming in media viewer https://product-fabric.atlassian.net/browse/DSP-6067
import React from 'react';
import { Component } from 'react';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import PlayIcon from '@atlaskit/icon/glyph/vid-play';
import PauseIcon from '@atlaskit/icon/glyph/vid-pause';
import FullScreenIconOn from '@atlaskit/icon/glyph/vid-full-screen-on';
import FullScreenIconOff from '@atlaskit/icon/glyph/vid-full-screen-off';
import SoundIcon from '@atlaskit/icon/glyph/hipchat/outgoing-sound';
import HDIcon from '@atlaskit/icon/glyph/vid-hd-circle';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import {
  MediaFeatureFlags,
  withMediaAnalyticsContext,
} from '@atlaskit/media-common';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import MediaButton from '../MediaButton';
import Spinner from '@atlaskit/spinner';
import { WidthObserver } from '@atlaskit/width-detector';
import MediaPlayer, { VideoState, VideoActions } from 'react-video-renderer';
import { N0, DN60 } from '@atlaskit/theme/colors';
import { NumericalCardDimensions } from '@atlaskit/media-common';
import { TimeRange } from './timeRange';
import { CustomMediaPlayerType } from './types';
import {
  CurrentTime,
  VideoWrapper,
  CustomVideoWrapper,
  TimebarWrapper,
  VolumeWrapper,
  TimeWrapper,
  LeftControls,
  RightControls,
  ControlsWrapper,
  VolumeToggleWrapper,
  MutedIndicator,
  SpinnerWrapper,
  VolumeTimeRangeWrapper,
} from './styled';
import {
  CustomMediaPlayerUIEvent,
  CustomMediaPlayerAnalyticsEventPayload,
  fireAnalyticsEvent,
  createCustomMediaPlayerScreenEvent,
  createMediaButtonClickedEvent,
  createMediaShortcutPressedEvent,
  createPlayPauseBlanketClickedEvent,
  createTimeRangeNavigatedEvent,
  createPlaybackSpeedChangedEvent,
  createFirstPlayedTrackEvent,
  createPlayedTrackEvent,
  PlaybackState,
  WithPlaybackProps,
  WithMediaPlayerState,
} from './analytics';
import { formatDuration } from '../formatDuration';
import { Shortcut, keyCodes } from '../shortcut';
import { toggleFullscreen, getFullscreenElement } from './fullscreen';
import { injectIntl, WrappedComponentProps } from 'react-intl-next';
import { messages } from '../messages';
import simultaneousPlayManager from './simultaneousPlayManager';
import { WithShowControlMethodProp } from '../types';
import { TimeSaver, TimeSaverConfig } from './timeSaver';
import PlaybackSpeedControls from './playbackSpeedControls';
import { PlayPauseBlanket } from './playPauseBlanket';
import Tooltip from '@atlaskit/tooltip';
import { SkipTenBackwardIcon, SkipTenForwardIcon } from './icons';
import { getControlsWrapperClassName } from './getControlsWrapperClassName';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

export interface CustomMediaPlayerProps
  extends WithPlaybackProps,
    WithShowControlMethodProp {
  readonly type: CustomMediaPlayerType;
  readonly src: string;
  readonly fileId?: string;
  readonly onHDToggleClick?: () => void;
  readonly isShortcutEnabled?: boolean;
  readonly lastWatchTimeConfig?: TimeSaverConfig;
  readonly onCanPlay?: () => void;
  readonly onError?: () => void;
  readonly onDownloadClick?: () => void;
  readonly onFirstPlay?: () => void;
  readonly onFullscreenChange?: (fullscreen: boolean) => void;
  readonly originalDimensions?: NumericalCardDimensions;
  readonly featureFlags?: MediaFeatureFlags;
  readonly poster?: string;
  readonly isVideoSelected?: boolean;
}

export interface CustomMediaPlayerState extends WithMediaPlayerState {
  areVideoControlsFocused: boolean;
}

export type Action = () => void;

const MEDIUM_VIDEO_MAX_WIDTH = 400;
const SMALL_VIDEO_MAX_WIDTH = 160;
const MINIMUM_DURATION_BEFORE_SAVING_TIME = 60;
const VIEWED_TRACKING_SECS = 2;

export class CustomMediaPlayerBase extends Component<
  CustomMediaPlayerProps & WrappedComponentProps & WithAnalyticsEventsProps,
  CustomMediaPlayerState
> {
  videoWrapperRef = React.createRef<HTMLDivElement>();
  controlsWrapperRef = React.createRef<HTMLDivElement>();
  videoPlayPauseButtonRef = React.createRef<HTMLButtonElement>();

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
  private clickToTogglePlayTimoutId: ReturnType<typeof setTimeout> | undefined;

  state: CustomMediaPlayerState = {
    isFullScreenEnabled: false,
    playerSize: 'large',
    playbackSpeed: 1,
    areVideoControlsFocused: false,
  };

  componentDidMount() {
    const {
      type,
      fileId,
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
        fileId,
      ),
      createAnalyticsEvent,
    );

    if (this.videoWrapperRef.current) {
      this.videoWrapperRef.current.addEventListener(
        'fullscreenchange',
        this.onFullScreenChange,
      );
    }

    if (
      getBooleanFF('platform.editor.a11y_video_controls_keyboard_support_yhcxh')
    ) {
      document.addEventListener('keydown', this.handleKeyDown);
      window.addEventListener('focus', this.onFocusChange, true);
      window.addEventListener('blur', this.onFocusChange, true);
    }

    simultaneousPlayManager.subscribe(this);

    if (isAutoPlay) {
      simultaneousPlayManager.pauseOthers(this);
      if (onFirstPlay) {
        this.fireFirstPlayedTrackEvent();
        this.wasPlayedOnce = true;
        onFirstPlay();
      }
    }
  }

  private fireFirstPlayedTrackEvent = () => {
    const {
      type,
      fileId,
      isHDActive,
      isHDAvailable,
      isAutoPlay,
      createAnalyticsEvent,
    } = this.props;
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
        fileId,
      ),
      createAnalyticsEvent,
    );
  };

  componentWillUnmount() {
    if (this.videoWrapperRef.current) {
      this.videoWrapperRef.current.removeEventListener(
        'fullscreenchange',
        this.onFullScreenChange,
      );
    }
    if (this.state.isFullScreenEnabled) {
      this.props.onFullscreenChange?.(false);
    }

    if (
      getBooleanFF('platform.editor.a11y_video_controls_keyboard_support_yhcxh')
    ) {
      document.removeEventListener('keydown', this.handleKeyDown);
      window.removeEventListener('focus', this.onFocusChange, true);
      window.removeEventListener('blur', this.onFocusChange, true);
    }

    simultaneousPlayManager.unsubscribe(this);
  }

  onFocusChange = () => {
    if (
      getBooleanFF('platform.editor.a11y_video_controls_keyboard_support_yhcxh')
    ) {
      //Check if element or any of it's children is focused
      this.setState({
        areVideoControlsFocused:
          !!this.controlsWrapperRef.current &&
          !!this.controlsWrapperRef.current.contains(document.activeElement),
      });
    }
  };

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

  private handleKeyDown = (event: KeyboardEvent) => {
    if (
      event.shiftKey &&
      (event.key === 'F10' || event.keyCode === 121) &&
      this.videoPlayPauseButtonRef.current &&
      this.props.isVideoSelected
    ) {
      event.preventDefault();
      this.videoPlayPauseButtonRef.current.focus();
      if (this.props.showControls) {
        this.props.showControls();
      }
    }
  };

  private onTimeChanged = () => {
    this.createAndFireUIEvent('timeRangeNavigate', 'time');
  };

  private onVolumeChanged = () => {
    this.createAndFireUIEvent('volumeRangeNavigate', 'volume');
  };

  private onCurrentTimeChange = (currentTime: number, duration: number) => {
    if (duration - currentTime > MINIMUM_DURATION_BEFORE_SAVING_TIME) {
      this.timeSaver.defaultTime = currentTime;
    } else {
      this.timeSaver.defaultTime = 0;
    }
  };

  private renderCurrentTime = ({ currentTime, duration }: VideoState) => {
    return (
      <CurrentTime draggable={false}>
        {formatDuration(currentTime)} / {formatDuration(duration)}
      </CurrentTime>
    );
  };

  private renderHDButton = () => {
    const { type, isHDAvailable, isHDActive, onHDToggleClick } = this.props;

    if (type === 'audio' || !isHDAvailable) {
      return;
    }

    const primaryColor = isHDActive ? '#579DFF' : '#c7d1db';
    const secondaryColor = isHDActive ? N0 : DN60;

    return (
      <MediaButton
        testId="custom-media-player-hd-button"
        onClick={
          !!onHDToggleClick
            ? this.getMediaButtonClickHandler(onHDToggleClick, 'HDButton')
            : undefined
        }
        iconBefore={
          <HDIcon
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            label="hd"
          />
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
        onClick={() =>
          this.createAndFireUIEvent('mediaButtonClick', 'playbackSpeedButton')
        }
      />
    );
  };

  private renderVolume = (
    videoState: VideoState,
    actions: VideoActions,
    showSlider: boolean,
  ) => (
    <VolumeWrapper showSlider={showSlider}>
      <VolumeToggleWrapper isMuted={videoState.isMuted}>
        <MutedIndicator isMuted={videoState.isMuted} />
        <MediaButton
          testId="custom-media-player-volume-toggle-button"
          onClick={this.getMediaButtonClickHandler(
            actions.toggleMute,
            'muteButton',
          )}
          iconBefore={<SoundIcon label="volume" />}
        />
      </VolumeToggleWrapper>
      {showSlider && (
        <VolumeTimeRangeWrapper>
          <TimeRange
            onChange={actions.setVolume}
            duration={1}
            currentTime={videoState.volume}
            bufferedTime={videoState.volume}
            disableThumbTooltip={true}
            isAlwaysActive={true}
            onChanged={this.onVolumeChanged}
          />
        </VolumeTimeRangeWrapper>
      )}
    </VolumeWrapper>
  );

  private toggleFullscreen = () =>
    this.videoWrapperRef.current &&
    toggleFullscreen(this.videoWrapperRef.current);

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
      <FullScreenIconOff label={formatMessage(messages.disable_fullscreen)} />
    ) : (
      <FullScreenIconOn label={formatMessage(messages.enable_fullscreen)} />
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
        onClick={this.getMediaButtonClickHandler(
          onDownloadClick,
          'downloadButton',
        )}
        iconBefore={<DownloadIcon label="download" />}
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
        handler={this.getKeyboardShortcutHandler(
          togglePlayPauseAction,
          'space',
        )}
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
      <PauseIcon label={formatMessage(messages.pause)} />
    ) : (
      <PlayIcon label={formatMessage(messages.play)} />
    );

    return (
      <Tooltip
        content={formatMessage(isPlaying ? messages.pause : messages.play)}
        position="top"
      >
        <MediaButton
          testId="custom-media-player-play-toggle-button"
          data-test-is-playing={isPlaying}
          iconBefore={toggleButtonIcon}
          buttonRef={this.videoPlayPauseButtonRef}
          onClick={
            isPlaying
              ? this.pausePlayByButtonClick
              : this.startPlayByButtonClick
          }
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
            <SkipTenBackwardIcon label={formatMessage(messages.skipBackward)} />
          }
          onClick={this.getMediaButtonClickHandler(
            skipBackward,
            'skipBackwardButton',
          )}
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
            <SkipTenForwardIcon label={formatMessage(messages.skipForward)} />
          }
          onClick={this.getMediaButtonClickHandler(
            skipForward,
            'skipForwardButton',
          )}
        />
      </Tooltip>
    );
  };

  private renderSpinner = () => (
    <SpinnerWrapper>
      <Spinner appearance="invert" size="large" />
    </SpinnerWrapper>
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
  };

  private getMediaButtonClickHandler =
    (action: Action, buttonType: string) => () => {
      action();
      this.createAndFireUIEvent('mediaButtonClick', buttonType);
    };

  private getKeyboardShortcutHandler =
    (action: Action, shortcutType: string) => () => {
      const { showControls } = this.props;
      action();

      if (showControls) {
        showControls();
      }

      this.createAndFireUIEvent('shortcutPress', shortcutType);
    };

  private createAndFireUIEvent(
    eventType: CustomMediaPlayerUIEvent,
    actionSubjectId?: string,
  ) {
    const {
      type,
      fileId,
      isHDActive,
      isHDAvailable,
      isAutoPlay,
      createAnalyticsEvent,
    } = this.props;
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
          fileId,
        );
        break;
      case 'shortcutPress':
        analyticsEvent = createMediaShortcutPressedEvent(
          type,
          playbackState,
          actionSubjectId,
          fileId,
        );
        break;
      case 'playPauseBlanketClick':
        analyticsEvent = createPlayPauseBlanketClickedEvent(
          type,
          playbackState,
          fileId,
        );
        break;
      case 'timeRangeNavigate':
      case 'volumeRangeNavigate':
        analyticsEvent = createTimeRangeNavigatedEvent(
          type,
          playbackState,
          actionSubjectId,
          fileId,
        );
        break;
      case 'playbackSpeedChange':
        analyticsEvent = createPlaybackSpeedChangedEvent(
          type,
          playbackState,
          fileId,
        );
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
    const {
      createAnalyticsEvent,
      fileId,
      isAutoPlay,
      isHDAvailable,
      isHDActive,
      type,
    } = this.props;
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
          fileId,
        ),
        createAnalyticsEvent,
      );
      this.lastCurrentTime = currentTime;
    }
  };

  private resetPendingPlayPauseToggleTimer = () => {
    if (this.clickToTogglePlayTimoutId !== undefined) {
      clearTimeout(this.clickToTogglePlayTimoutId);
    }
  };

  private doubleClickToFullscreen = () => {
    this.resetPendingPlayPauseToggleTimer();
    this.toggleFullscreen();
    // TODO Add an event similar to "playPauseBlanketClick" but for fullscreen trigger
  };

  private togglePlayByBlanketClick = (action: () => void) => {
    this.resetPendingPlayPauseToggleTimer();
    this.clickToTogglePlayTimoutId = setTimeout(() => {
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

  private startPlayByButtonClick = this.getMediaButtonClickHandler(
    this.play,
    'playButton',
  );
  private pausePlayByButtonClick = this.getMediaButtonClickHandler(
    this.pause,
    'pauseButton',
  );

  render() {
    const { type, src, isAutoPlay, onCanPlay, onError, poster } = this.props;

    return (
      <CustomVideoWrapper
        ref={this.videoWrapperRef}
        data-testid="custom-media-player"
      >
        <MediaPlayer
          sourceType={type}
          src={src}
          autoPlay={isAutoPlay}
          onCanPlay={onCanPlay}
          defaultTime={this.timeSaver.defaultTime}
          onTimeChange={this.onCurrentTimeChange}
          onError={onError}
          poster={poster}
        >
          {(video, videoState, actions) => {
            this.onViewed(videoState);
            this.setActions(actions);
            //Video State(either prop or variable) is ReadOnly
            this.videoState = videoState;
            const { status, currentTime, buffered, duration, isLoading } =
              videoState;
            const { playerSize } = this.state;
            const isPlaying = status === 'playing';

            const isLargePlayer = playerSize === 'large';
            const isMediumPlayer = playerSize === 'medium';

            const skipAmount = 10;
            const skipBackward = () => {
              const newTime = videoState.currentTime - skipAmount;
              actions.navigate(Math.max(newTime, 0));
            };

            const skipForward = () => {
              const newTime = videoState.currentTime + skipAmount;
              actions.navigate(Math.min(newTime, videoState.duration));
            };

            const shortcuts = this.renderShortcuts({
              togglePlayPauseAction: isPlaying ? this.pause : this.play,
              toggleMute: actions.toggleMute,
              skipBackward,
              skipForward,
            });
            return (
              <VideoWrapper>
                <WidthObserver setWidth={this.onResize} />
                {shortcuts}
                {isLoading && this.renderSpinner()}
                <PlayPauseBlanket
                  onDoubleClick={this.doubleClickToFullscreen}
                  onClick={
                    isPlaying
                      ? this.pausePlayByBlanketClick
                      : this.startPlayByBlanketClick
                  }
                  data-testid="play-pause-blanket"
                >
                  {video}
                </PlayPauseBlanket>
                <ControlsWrapper
                  ref={this.controlsWrapperRef}
                  className={
                    getBooleanFF(
                      'platform.editor.a11y_video_controls_keyboard_support_yhcxh',
                    )
                      ? getControlsWrapperClassName(
                          this.wasPlayedOnce,
                          this.state.areVideoControlsFocused,
                        )
                      : getControlsWrapperClassName(this.wasPlayedOnce)
                  }
                >
                  <TimeWrapper>
                    <TimeRange
                      currentTime={currentTime}
                      bufferedTime={buffered}
                      duration={duration}
                      onChange={actions.navigate}
                      onChanged={this.onTimeChanged}
                    />
                  </TimeWrapper>
                  <TimebarWrapper>
                    <LeftControls>
                      {this.renderPlayPauseButton(isPlaying)}
                      {isLargePlayer &&
                        this.renderSkipBackwardButton(skipBackward)}
                      {isLargePlayer &&
                        this.renderSkipForwardButton(skipForward)}
                      {this.renderVolume(videoState, actions, isLargePlayer)}
                    </LeftControls>
                    <RightControls>
                      {(isMediumPlayer || isLargePlayer) &&
                        this.renderCurrentTime(videoState)}
                      {isLargePlayer && this.renderHDButton()}
                      {isLargePlayer && this.renderSpeedControls()}
                      {this.renderFullScreenButton()}
                      {isLargePlayer && this.renderDownloadButton()}
                    </RightControls>
                  </TimebarWrapper>
                </ControlsWrapper>
              </VideoWrapper>
            );
          }}
        </MediaPlayer>
      </CustomVideoWrapper>
    );
  }
}

export const CustomMediaPlayer: React.ComponentType<
  CustomMediaPlayerProps & WithAnalyticsEventsProps
> = withMediaAnalyticsContext({
  packageVersion,
  packageName,
  componentName: 'customMediaPlayer',
  component: 'customMediaPlayer',
})(withAnalyticsEvents()(injectIntl(CustomMediaPlayerBase)));
