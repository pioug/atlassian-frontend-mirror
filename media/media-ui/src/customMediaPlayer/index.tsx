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
import MediaPlayer, {
  SetVolumeFunction,
  NavigateFunction,
  VideoState,
  VideoActions,
} from 'react-video-renderer';
import { B200, DN400, N0, DN60 } from '@atlaskit/theme/colors';
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
import {
  toggleFullscreen,
  getFullscreenElement,
  vendorify,
} from './fullscreen';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { messages } from '../messages';
import simultaneousPlayManager from './simultaneousPlayManager';
import { WithShowControlMethodProp } from '../types';

export interface CustomMediaPlayerProps extends WithShowControlMethodProp {
  readonly type: 'audio' | 'video';
  readonly src: string;
  readonly isHDActive?: boolean;
  readonly onHDToggleClick?: () => void;
  readonly isHDAvailable?: boolean;
  readonly isAutoPlay: boolean;
  readonly isShortcutEnabled?: boolean;
  readonly onCanPlay?: () => void;
  readonly onError?: () => void;
  readonly onDownloadClick?: () => void;
  readonly onFirstPlay?: () => void;
}

export interface CustomMediaPlayerState {
  isFullScreenEnabled: boolean;
}

export type ToggleButtonAction = () => void;

export type CustomMediaPlayerActions = {
  play: () => void;
  pause: () => void;
};

const toolbar: any = 'toolbar';

export class CustomMediaPlayer extends Component<
  CustomMediaPlayerProps & InjectedIntlProps,
  CustomMediaPlayerState
> {
  videoWrapperRef?: HTMLElement;
  private actions?: CustomMediaPlayerActions;
  private wasPlayedOnce: boolean = false;

  state: CustomMediaPlayerState = {
    isFullScreenEnabled: false,
  };

  componentDidMount() {
    const { isAutoPlay, onFirstPlay } = this.props;
    document.addEventListener(
      vendorify('fullscreenchange', false),
      this.onFullScreenChange,
    );

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
    document.removeEventListener(
      vendorify('fullscreenchange', false),
      this.onFullScreenChange,
    );
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

  shortcutHandler = (toggleButtonAction: ToggleButtonAction) => () => {
    const { showControls } = this.props;

    toggleButtonAction();

    if (showControls) {
      showControls();
    }
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
        appearance={toolbar}
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

  renderVolume = ({ isMuted, volume }: VideoState, actions: VideoActions) => {
    return (
      <VolumeWrapper>
        <VolumeToggleWrapper isMuted={isMuted}>
          <MutedIndicator isMuted={isMuted} />
          <MediaButton
            appearance={toolbar}
            onClick={actions.toggleMute}
            iconBefore={<SoundIcon label="volume" />}
          />
        </VolumeToggleWrapper>
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
      </VolumeWrapper>
    );
  };

  onFullScreenClick = () => toggleFullscreen(this.videoWrapperRef);

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
        data-testid="custom-media-player-fullscreen-button"
        appearance={toolbar}
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
        data-testid="custom-media-player-download-button"
        appearance={toolbar}
        onClick={onDownloadClick}
        iconBefore={<DownloadIcon label="download" />}
      />
    );
  };

  renderSpinner = () => (
    <SpinnerWrapper>
      <Spinner invertColor size="large" />
    </SpinnerWrapper>
  );

  private setActions(actions: VideoActions) {
    // Actions are being sent constantly while the video is playing,
    // though play and pause functions are always the same objects
    if (!this.actions) {
      const { play, pause } = actions;
      this.actions = { play, pause };
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
      <CustomVideoWrapper innerRef={this.saveVideoWrapperRef}>
        <MediaPlayer
          sourceType={type}
          src={src}
          autoPlay={isAutoPlay}
          onCanPlay={onCanPlay}
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
            const isPlaying = status === 'playing';
            const toggleButtonIcon = isPlaying ? (
              <PauseIcon label={formatMessage(messages.play)} />
            ) : (
              <PlayIcon label={formatMessage(messages.pause)} />
            );
            const toggleButtonAction = isPlaying ? this.pause : this.play;
            const button = (
              <MediaButton
                data-testid="custom-media-player-play-toggle-button"
                data-test-is-playing={isPlaying}
                appearance={toolbar}
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
                {video}
                {isLoading && this.renderSpinner()}
                {shortcuts}
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
                      {this.renderVolume(videoState, actions)}
                    </LeftControls>
                    <RightControls>
                      <CurrentTime draggable={false}>
                        {formatDuration(currentTime)} /{' '}
                        {formatDuration(duration)}
                      </CurrentTime>
                      {this.renderHDButton()}
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
