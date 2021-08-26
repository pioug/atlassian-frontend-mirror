import React from 'react';
import { Component } from 'react';
import {
  PopupSelect,
  OptionType,
  StylesConfig,
  ValueType,
  GroupedOptionsType,
} from '@atlaskit/select';
import { B200, N900, N0, N600 } from '@atlaskit/theme/colors';
import { NumericalCardDimensions } from '@atlaskit/media-common';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import Tooltip from '@atlaskit/tooltip';
import MediaButton from '../MediaButton';
import { messages } from '../messages';
import { WidthObserver } from '@atlaskit/width-detector';

export interface PlaybackSpeedControlsProps {
  playbackSpeed: number;
  onPlaybackSpeedChange: (playbackSpeed: number) => void;
  originalDimensions?: NumericalCardDimensions;
  onClick?: () => void;
}

export interface PlaybackSpeedControlsState {
  popupHeight: number;
}

export class PlaybackSpeedControls extends Component<
  PlaybackSpeedControlsProps & InjectedIntlProps,
  PlaybackSpeedControlsState
> {
  state: PlaybackSpeedControlsState = {
    popupHeight: 255,
  };
  private onPlaybackSpeedChange = (option: ValueType<OptionType>) => {
    const { onPlaybackSpeedChange } = this.props;
    if (!option) {
      return;
    }

    const playbackSpeed = parseFloat(`${(option as OptionType).value}`);
    onPlaybackSpeedChange(playbackSpeed);
  };

  private speedOptions: () => GroupedOptionsType<OptionType> = () => [
    {
      label: <FormattedMessage {...messages.playbackSpeed} />,
      options: [
        { label: '0.75x', value: 0.75 },
        { label: '1x', value: 1 },
        { label: '1.25x', value: 1.25 },
        { label: '1.5x', value: 1.5 },
        { label: '2x', value: 2 },
      ],
    },
  ];

  private popupCustomStyles: StylesConfig = {
    container: (styles) => ({ ...styles, backgroundColor: N900 }),
    // added these overrides to keep the look of the current design
    // however this does not benefit from the DS a11y changes
    menuList: (styles) => ({ ...styles, padding: '4px 0px' }),
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      color: isSelected ? N0 : 'inherit',
      backgroundColor: isSelected ? B200 : isFocused ? N600 : N900,
    }),
  };

  private onResize = (width: number) => {
    const { originalDimensions } = this.props;
    if (originalDimensions) {
      const aspectRatio = originalDimensions.height / originalDimensions.width;
      const controlsSize = 60;
      const minimumHeight = 100;
      const popupHeight = Math.max(
        aspectRatio * width - controlsSize,
        minimumHeight,
      );

      this.setState({ popupHeight });
    }
    // This is a hacky solution. Please replace with a better one if you find one.
    // There is something inside popper.js that recalc position on scroll.
    // We enable this functionality with `eventListeners` modifier.
    // Here we simulate scroll even to trick popper.js to recalc position.
    window.dispatchEvent(new CustomEvent('scroll'));
  };

  render() {
    const { playbackSpeed, intl, onClick } = this.props;
    const { popupHeight } = this.state;
    const value = this.speedOptions()[0].options.find(
      (option) => option.value === playbackSpeed,
    );

    const popperProps: PopupSelect['props']['popperProps'] = {
      strategy: 'fixed',
      modifiers: [
        {
          name: 'preventOverflow',
          enabled: true,
        },
        {
          name: 'eventListeners',
          options: {
            scroll: true,
            resize: true,
          },
        },
        {
          name: 'offset',
          enabled: true,
          options: {
            offset: [0, 10],
          },
        },
      ],
      placement: 'top',
    };

    return (
      <>
        <WidthObserver setWidth={this.onResize} />
        <PopupSelect
          minMenuWidth={140}
          maxMenuHeight={popupHeight}
          options={this.speedOptions()}
          value={value}
          theme={(theme) => ({
            ...theme,
            colors: { ...theme.colors, primary25: N600 },
          })}
          closeMenuOnScroll={true}
          onChange={this.onPlaybackSpeedChange}
          target={({ ref, isOpen }) => (
            <Tooltip
              content={intl.formatMessage(messages.playbackSpeed)}
              position="top"
            >
              <MediaButton
                testId="custom-media-player-playback-speed-toggle-button"
                buttonRef={ref}
                isSelected={isOpen}
                onClick={onClick}
              >
                {playbackSpeed}x
              </MediaButton>
            </Tooltip>
          )}
          styles={this.popupCustomStyles}
          popperProps={popperProps}
        />
      </>
    );
  }
}

export default injectIntl(PlaybackSpeedControls);
