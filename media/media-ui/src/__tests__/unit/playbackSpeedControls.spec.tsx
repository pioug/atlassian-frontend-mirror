jest.mock('@atlaskit/select');

import React from 'react';
import { shallow } from 'enzyme';
import { OptionType, PopupSelect, PopupSelectProps } from '@atlaskit/select';
import { WidthObserver } from '@atlaskit/width-detector';
import PlaybackSpeedControls, {
  PlaybackSpeedControlsProps,
} from '../../customMediaPlayer/playbackSpeedControls';
import MediaButton from '../../MediaButton';
import { mountWithIntlContext } from '@atlaskit/media-test-helpers';

describe('<PlaybackSpeedControls />', () => {
  const mountSetup = (props: Partial<PlaybackSpeedControlsProps> = {}) => {
    const onPlaybackSpeedChange = jest.fn();
    const component = mountWithIntlContext(
      <PlaybackSpeedControls
        {...props}
        onPlaybackSpeedChange={onPlaybackSpeedChange}
        playbackSpeed={1.5}
      />,
    );

    const popupSelect = component.find<PopupSelectProps<OptionType>>(
      PopupSelect,
    );

    return {
      component,
      onPlaybackSpeedChange,
      popupSelect,
    };
  };

  it('should render current playback speed as selected', () => {
    const { popupSelect } = mountSetup();

    expect(popupSelect.props().value).toEqual({
      label: '1.5x',
      value: 1.5,
    });
  });

  it('should trigger onPlaybackSpeedChange when speed changes', () => {
    const { popupSelect, onPlaybackSpeedChange } = mountSetup();

    const { onChange } = popupSelect.props();
    if (!onChange) {
      return expect(onChange).toBeDefined();
    }
    onChange(
      {
        label: '1.5x',
        value: 1.5,
      },
      { action: 'select-option', option: undefined },
    );

    expect(onPlaybackSpeedChange).toBeCalledTimes(1);
    expect(onPlaybackSpeedChange).toBeCalledWith(1.5);
  });

  describe('with MediaButton as target', () => {
    const buttonSetup = (isOpen: boolean = true) => {
      const { popupSelect } = mountSetup();
      const target = popupSelect.props().target;
      if (!target) {
        expect(target).toBeDefined();
        throw Error(); // For TS happiness. JEst would throw on prev. line anyway.
      }
      const myRef = React.createRef();
      const elementFunc = target({
        ref: myRef,
        isOpen,
        'aria-haspopup': 'true',
        'aria-expanded': isOpen,
      });
      const Component = (): React.ReactElement => <>${elementFunc}</>;

      return {
        targetElement: shallow(<Component />),
        myRef,
      };
    };

    it('should be selected when isPlayBackSpeedOpen is true', () => {
      const { targetElement } = buttonSetup(true);
      expect(targetElement.find(MediaButton).props().isSelected).toEqual(true);
    });

    it('should be not selected when isPlayBackSpeedOpen is false', () => {
      const { targetElement } = buttonSetup(false);
      expect(targetElement.find(MediaButton).props().isSelected).toEqual(false);
    });

    it('should get provided buttonRef', () => {
      const { targetElement, myRef } = buttonSetup(false);
      expect(targetElement.find(MediaButton).props().buttonRef).toBe(myRef);
    });

    it('should have proper testId', () => {
      const { targetElement } = buttonSetup();
      expect(targetElement.find(MediaButton).props().testId).toBe(
        'custom-media-player-playback-speed-toggle-button',
      );
    });
  });

  it('should have max and min height and width on PopupSelect', () => {
    const { popupSelect } = mountSetup();
    const { minMenuWidth, maxMenuHeight } = popupSelect.props();
    expect(minMenuWidth).toEqual(140);
    expect(maxMenuHeight).toEqual(255);
  });

  it('should change max height when parent width changes', () => {
    const { component, popupSelect } = mountSetup({
      originalDimensions: {
        height: 360,
        width: 640,
      },
    });
    // Mock WidthObserver resize
    component.find(WidthObserver).prop('setWidth')(250);
    expect(popupSelect.prop('maxMenuHeight')).toEqual(100);
  });

  it('should have closeMenuOnScroll set to true', () => {
    const { popupSelect } = mountSetup();
    expect(popupSelect.props().closeMenuOnScroll).toEqual(true);
  });

  it('should have all 5 speed options in PopupSelect', () => {
    const { popupSelect } = mountSetup();
    const { options } = popupSelect.props();
    if (!options) {
      return expect(options).toBeDefined();
    }
    expect(options[0].options).toHaveLength(5);
    expect(options[0].options).toContainEqual(
      expect.objectContaining<Partial<OptionType>>({ value: 0.75 }),
    );
    expect(options[0].options).toContainEqual(
      expect.objectContaining<Partial<OptionType>>({ value: 1 }),
    );
    expect(options[0].options).toContainEqual(
      expect.objectContaining<Partial<OptionType>>({ value: 1.25 }),
    );
    expect(options[0].options).toContainEqual(
      expect.objectContaining<Partial<OptionType>>({ value: 1.5 }),
    );
    expect(options[0].options).toContainEqual(
      expect.objectContaining<Partial<OptionType>>({ value: 2 }),
    );
  });
});
