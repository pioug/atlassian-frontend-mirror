import React from 'react';
import { Component } from 'react';
import PlayIcon from '@atlaskit/icon/glyph/vid-play';
import PauseIcon from '@atlaskit/icon/glyph/vid-pause';
import FullScreenIconOn from '@atlaskit/icon/glyph/vid-full-screen-on';
import FullScreenIconOff from '@atlaskit/icon/glyph/vid-full-screen-off';
import SoundIcon from '@atlaskit/icon/glyph/hipchat/outgoing-sound';
import HDIcon from '@atlaskit/icon/glyph/vid-hd-circle';
import DownloadIcon from '@atlaskit/icon/glyph/download';

import MediaButton from '../MediaButton';
import Spinner from '@atlaskit/spinner';
import { WidthObserver } from '@atlaskit/width-detector';
import MediaPlayer, {
  SetVolumeFunction,
  NavigateFunction,
  VideoState,
  VideoActions,
} from 'react-video-renderer';
import { B200, DN400, N0, DN60 } from '@atlaskit/theme/colors';
import { NumericalCardDimensions } from '@atlaskit/media-common';
import { TimeRange } from './timeRange';
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

export interface CustomMediaPlayerProps extends WithShowControlMethodProp {
  readonly type: 'audio' | 'video';
  readonly src: string;
  readonly isHDActive?: boolean;
  readonly onHDToggleClick?: () => void;
  readonly isHDAvailable?: boolean;
  readonly isAutoPlay: boolean;
  readonly isShortcutEnabled?: boolean;
  readonly lastWatchTimeConfig?: TimeSaverConfig;
  readonly onCanPlay?: () => void;
  readonly onError?: () => void;
  readonly onDownloadClick?: () => void;
  readonly onFirstPlay?: () => void;
  readonly originalDimensions?: NumericalCardDimensions;
}

export interface CustomMediaPlayerState {
  isLargePlayer: boolean;
  isFullScreenEnabled: boolean;
  playbackSpeed: number;
}

export type ToggleButtonAction = () => void;

const SMALL_VIDEO_MAX_WIDTH = 400;
const MINIMUM_DURATION_BEFORE_SAVING_TIME = 60;

export class CustomMediaPlayer extends Component<
  CustomMediaPlayerProps & InjectedIntlProps,
  CustomMediaPlayerState
> {
  videoWrapperRef?: HTMLElement;
  private actions?: VideoActions;
  private wasPlayedOnce: boolean = false;
  private readonly timeSaver = new TimeSaver(this.props.lastWatchTimeConfig);

  state: CustomMediaPlayerState = {
    isFullScreenEnabled: false,
    isLargePlayer: true,
    playbackSpeed: 1,
  };

  componentDidMount() {
    const { isAutoPlay, onFirstPlay } = this.props;
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

  onFullScreenChange = (e: Event) => {
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

  onTimeChange = (navigate: NavigateFunction) => (value: number) => {
    navigate(value);
  };

  onVolumeChange = (setVolume: SetVolumeFunction) => (value: number) =>
    setVolume(value);

  onCurrentTimeChange = (currentTime: number, duration: number) => {
    if (duration - currentTime > MINIMUM_DURATION_BEFORE_SAVING_TIME) {
      this.timeSaver.defaultTime = currentTime;
    } else {
      this.timeSaver.defaultTime = 0;
    }
  };

  shortcutHandler = (toggleButtonAction: ToggleButtonAction) => () => {
    const { showControls } = this.props;
    toggleButtonAction();

    if (showControls) {
      showControls();
    }
  };

  renderCurrentTime = ({ currentTime, duration }: VideoState) => {
    return (
      <CurrentTime draggable={false}>
        {formatDuration(currentTime)} / {formatDuration(duration)}
      </CurrentTime>
    );
  };

  renderHDButton = () => {
    const { type, isHDAvailable, isHDActive, onHDToggleClick } = this.props;

    if (type === 'audio' || !isHDAvailable) {
      return;
    }
    const primaryColor = isHDActive ? B200 : DN400;
    const secondaryColor = isHDActive ? N0 : DN60;

    return (
      <MediaButton
        testId="custom-media-player-hd-button"
        onClick={onHDToggleClick}
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
  };

  private renderSpeedControls = () => {
    const { playbackSpeed } = this.state;
    const { originalDimensions } = this.props;

    return (
      <PlaybackSpeedControls
        originalDimensions={originalDimensions}
        playbackSpeed={playbackSpeed}
        onPlaybackSpeedChange={this.onPlaybackSpeedChange}
      />
    );
  };

  renderVolume = (
    { isMuted, volume }: VideoState,
    actions: VideoActions,
    showSlider: boolean,
  ) => {
    return (
      <VolumeWrapper showSlider={showSlider}>
        <VolumeToggleWrapper isMuted={isMuted}>
          <MutedIndicator isMuted={isMuted} />
          <MediaButton
            testId="custom-media-player-volume-toggle-button"
            onClick={actions.toggleMute}
            iconBefore={<SoundIcon label="volume" />}
          />
        </VolumeToggleWrapper>
        {showSlider && (
          <VolumeTimeRangeWrapper>
            <TimeRange
              onChange={this.onVolumeChange(actions.setVolume)}
              duration={1}
              currentTime={volume}
              bufferedTime={volume}
              disableThumbTooltip={true}
              isAlwaysActive={true}
            />
          </VolumeTimeRangeWrapper>
        )}
      </VolumeWrapper>
    );
  };

  onFullScreenClick = () => toggleFullscreen(this.videoWrapperRef);

  onResize = (width: number) =>
    this.setState({
      isLargePlayer: width > SMALL_VIDEO_MAX_WIDTH,
    });

  saveVideoWrapperRef = (el?: HTMLElement) => (this.videoWrapperRef = el);

  renderFullScreenButton = () => {
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
        onClick={this.onFullScreenClick}
        iconBefore={icon}
      />
    );
  };

  renderDownloadButton = () => {
    const { onDownloadClick } = this.props;
    if (!onDownloadClick) {
      return;
    }

    return (
      <MediaButton
        testId="custom-media-player-download-button"
        onClick={onDownloadClick}
        iconBefore={<DownloadIcon label="download" />}
      />
    );
  };

  renderSpinner = () => (
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

  render() {
    const {
      type,
      src,
      isAutoPlay,
      isShortcutEnabled,
      intl: { formatMessage },
      onCanPlay,
      onError,
    } = this.props;
    const { isFullScreenEnabled } = this.state;
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
            this.setActions(actions);
            const {
              status,
              currentTime,
              buffered,
              duration,
              isLoading,
            } = videoState;
            const { isLargePlayer } = this.state;
            const isPlaying = status === 'playing';
            const toggleButtonIcon = isPlaying ? (
              <PauseIcon label={formatMessage(messages.play)} />
            ) : (
              <PlayIcon label={formatMessage(messages.pause)} />
            );
            const toggleButtonAction = isPlaying ? this.pause : this.play;
            const button = (
              <MediaButton
                testId="custom-media-player-play-toggle-button"
                data-test-is-playing={isPlaying}
                iconBefore={toggleButtonIcon}
                onClick={toggleButtonAction}
              />
            );
            const shortcuts = (isShortcutEnabled || isFullScreenEnabled) && [
              <Shortcut
                key="space-shortcut"
                keyCode={keyCodes.space}
                handler={this.shortcutHandler(toggleButtonAction)}
              />,
              <Shortcut
                key="m-shortcut"
                keyCode={keyCodes.m}
                handler={this.shortcutHandler(actions.toggleMute)}
              />,
            ];
            return (
              <VideoWrapper>
                <WidthObserver setWidth={this.onResize} />
                {shortcuts}
                {isLoading && this.renderSpinner()}
                <PlayPauseBlanket
                  onClick={this.shortcutHandler(toggleButtonAction)}
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
                      onChange={this.onTimeChange(actions.navigate)}
                    />
                  </TimeWrapper>
                  <TimebarWrapper>
                    <LeftControls>
                      {button}
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

export default injectIntl(CustomMediaPlayer);
