import React from 'react';
import { Component } from 'react';
import {
  version as packageVersion,
  name as packageName,
} from '../version.json';
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

import MediaButton from '../MediaButton';
import Spinner from '@atlaskit/spinner';
import { WidthObserver } from '@atlaskit/width-detector';
import MediaPlayer, { VideoState, VideoActions } from 'react-video-renderer';
import { B200, DN400, N0, DN60 } from '@atlaskit/theme/colors';
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
  relevantFeatureFlagNames,
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
import { hideControlsClassName } from '../classNames';
import { Shortcut, keyCodes } from '../shortcut';
import { toggleFullscreen, getFullscreenElement } from './fullscreen';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { messages } from '../messages';
import simultaneousPlayManager from './simultaneousPlayManager';
import { WithShowControlMethodProp } from '../types';
import { TimeSaver, TimeSaverConfig } from './timeSaver';
import PlaybackSpeedControls from './playbackSpeedControls';
import { PlayPauseBlanket } from './playPauseBlanket';
import Tooltip from '@atlaskit/tooltip';
import { SkipTenBackwardIcon, SkipTenForwardIcon } from './icons';

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
  readonly originalDimensions?: NumericalCardDimensions;
  readonly featureFlags?: MediaFeatureFlags;
}

export interface CustomMediaPlayerState extends WithMediaPlayerState {}

export type Action = () => void;

const SMALL_VIDEO_MAX_WIDTH = 400;
const MINIMUM_DURATION_BEFORE_SAVING_TIME = 60;
const VIEWED_TRACKING_SECS = 2;

export class CustomMediaPlayerBase extends Component<
  CustomMediaPlayerProps & InjectedIntlProps & WithAnalyticsEventsProps,
  CustomMediaPlayerState
> {
  videoWrapperRef?: HTMLElement;
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
    isLargePlayer: true,
    playbackSpeed: 1,
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
    const { isFullScreenEnabled, isLargePlayer, playbackSpeed } = this.state;

    fireAnalyticsEvent(
      createCustomMediaPlayerScreenEvent(
        type,
        {
          isAutoPlay,
          isHDAvailable,
          isHDActive,
          isFullScreenEnabled,
          isLargePlayer,
          playbackSpeed,
        },
        fileId,
      ),
      createAnalyticsEvent,
    );

    if (this.videoWrapperRef) {
      this.videoWrapperRef.addEventListener(
        'fullscreenchange',
        this.onFullScreenChange,
      );
    }

    simultaneousPlayManager.subscribe(this);

    if (isAutoPlay) {
      simultaneousPlayManager.pauseOthers(this);
      if (onFirstPlay) {
        fireAnalyticsEvent(
          createFirstPlayedTrackEvent(
            type,
            {
              isAutoPlay,
              isHDAvailable,
              isHDActive,
              isFullScreenEnabled,
              isLargePlayer,
              playbackSpeed,
            },
            fileId,
          ),
          createAnalyticsEvent,
        );

        this.wasPlayedOnce = true;
        onFirstPlay();
      }
    }
  }

  componentWillUnmount() {
    if (this.videoWrapperRef) {
      this.videoWrapperRef.removeEventListener(
        'fullscreenchange',
        this.onFullScreenChange,
      );
    }
    simultaneousPlayManager.unsubscribe(this);
  }

  private onFullScreenChange = (e: Event) => {
    if (e.target !== this.videoWrapperRef) {
      return;
    }
    const { isFullScreenEnabled: currentFullScreenMode } = this.state;
    const isFullScreenEnabled = !!getFullscreenElement();

    if (currentFullScreenMode !== isFullScreenEnabled) {
      this.setState({
        isFullScreenEnabled,
      });
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
    const primaryColor = isHDActive ? B200 : DN400;
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

  private toggleFullscreen = () => toggleFullscreen(this.videoWrapperRef);

  private onFullScreenButtonClick = () => {
    this.toggleFullscreen();
    this.createAndFireUIEvent('mediaButtonClick', 'fullScreenButton');
  };

  private onResize = (width: number) =>
    this.setState({
      isLargePlayer: width > SMALL_VIDEO_MAX_WIDTH,
    });

  private saveVideoWrapperRef = (el?: HTMLElement) =>
    (this.videoWrapperRef = el);

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
      this.wasPlayedOnce = true;
      onFirstPlay();
    }
  };

  private getMediaButtonClickHandler = (
    action: Action,
    buttonType: string,
  ) => () => {
    action();
    this.createAndFireUIEvent('mediaButtonClick', buttonType);
  };

  private getKeyboardShortcutHandler = (
    action: Action,
    shortcutType: string,
  ) => () => {
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
    const { isFullScreenEnabled, isLargePlayer, playbackSpeed } = this.state;
    const playbackState: PlaybackState = {
      ...this.videoState,
      isAutoPlay,
      isHDAvailable,
      isHDActive,
      isFullScreenEnabled,
      isLargePlayer,
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
    const { isFullScreenEnabled, isLargePlayer, playbackSpeed } = this.state;
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
            isLargePlayer,
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
    const { type, src, isAutoPlay, onCanPlay, onError } = this.props;

    return (
      <CustomVideoWrapper
        innerRef={this.saveVideoWrapperRef}
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
        >
          {(video, videoState, actions) => {
            this.onViewed(videoState);
            this.setActions(actions);
            //Video State(either prop or variable) is ReadOnly
            this.videoState = videoState;
            const {
              status,
              currentTime,
              buffered,
              duration,
              isLoading,
            } = videoState;
            const { isLargePlayer } = this.state;
            const isPlaying = status === 'playing';

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
                <ControlsWrapper className={hideControlsClassName}>
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
                      {this.renderSkipBackwardButton(skipBackward)}
                      {this.renderSkipForwardButton(skipForward)}
                      {this.renderVolume(videoState, actions, isLargePlayer)}
                    </LeftControls>
                    <RightControls>
                      {isLargePlayer && this.renderCurrentTime(videoState)}
                      {this.renderHDButton()}
                      {this.renderSpeedControls()}
                      {this.renderFullScreenButton()}
                      {this.renderDownloadButton()}
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

export const CustomMediaPlayer = withMediaAnalyticsContext(
  {
    packageVersion,
    packageName,
    componentName: 'customMediaPlayer',
    component: 'customMediaPlayer',
  },

  {
    filterFeatureFlags: relevantFeatureFlagNames,
  },
)(withAnalyticsEvents()(injectIntl(CustomMediaPlayerBase)));
