import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import { Props } from '../../../../../plugins/media/ui/MediaPicker/PickerFacadeProvider';
import { Clipboard as ClipboardComponent } from '@atlaskit/media-picker';
import { Browser as BrowserComponent } from '@atlaskit/media-picker';
import { Dropzone as DropzoneComponent } from '@atlaskit/media-picker';

jest.mock(
  '../../../../../plugins/media/ui/MediaPicker/PickerFacadeProvider.tsx',
  () => {
    const {
      getDefaultMediaClientConfig,
    } = require('@atlaskit/media-test-helpers');
    const picker: any = {
      on: jest.fn(),
      onClose: jest.fn(),
      onNewMedia: jest.fn(),
      onMediaEvent: jest.fn(),
      onDrag: jest.fn(),
      hide: jest.fn(),
      setUploadParams: jest.fn(),
      show: jest.fn(),
      deactivate: jest.fn(),
      activate: jest.fn(),
      destroy: jest.fn(),
      type: 'popup',
    };
    picker.init = jest.fn().mockReturnValue(picker);
    return ({ children }: Props) =>
      children({
        mediaClientConfig: getDefaultMediaClientConfig(),
        config: {
          uploadParams: {},
        },
        pickerFacadeInstance: picker,
      });
  },
);

import { ClipboardWrapper } from '../../../../../plugins/media/ui/MediaPicker/ClipboardWrapper';
import { BrowserWrapper } from '../../../../../plugins/media/ui/MediaPicker/BrowserWrapper';
import { DropzoneWrapper } from '../../../../../plugins/media/ui/MediaPicker/DropzoneWrapper';
import { MediaPickerComponents } from '../../../../../plugins/media/ui/MediaPicker';
import { MediaPluginState } from '../../../../../plugins/media/pm-plugins/types';

describe('MediaPickerComponents', () => {
  let pluginState: MediaPluginState;
  let wrapper: ReactWrapper<MediaPickerComponents>;

  beforeEach(() => {
    pluginState = {} as MediaPluginState;
    pluginState.shouldUseMediaPickerPopup = jest.fn();
    pluginState.handleDrag = jest.fn();
    pluginState.options = {
      providerFactory: {} as any,
      nodeViews: {},
      allowResizing: false,
      customDropzoneContainer: document.createElement('div'),
    };
    pluginState.onPopupToggle = jest.fn();
    pluginState.setBrowseFn = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should subscribe to mediaState.onPopupToggle on mount', () => {
    mount(<MediaPickerComponents mediaState={pluginState} />);
    expect(pluginState.onPopupToggle).toBeCalled();
  });

  it('should change state when mediaState.onPopupToggle is called', () => {
    let callback: (isOpen: boolean) => void = () => {};
    pluginState.onPopupToggle = cb => (callback = cb);
    wrapper = mount(<MediaPickerComponents mediaState={pluginState} />);
    callback(true);
    expect(wrapper.state()).toHaveProperty('isPopupOpened', true);
    callback(false);
    expect(wrapper.state()).toHaveProperty('isPopupOpened', false);
  });

  it('should render <ClipboardWrapper /> component', () => {
    wrapper = mount(<MediaPickerComponents mediaState={pluginState} />);
    expect(wrapper.find(ClipboardWrapper)).toHaveLength(1);
    expect(wrapper.find(ClipboardWrapper).prop('mediaState')).toBe(pluginState);
    expect(wrapper.find(ClipboardComponent)).toHaveLength(1);
  });

  describe('<BrowserWrapper />', () => {
    it('should not render <BrowserWrapper /> component if mediaState.shouldUseMediaPickerPopup() is true', () => {
      pluginState.shouldUseMediaPickerPopup = jest.fn().mockReturnValue(true);
      wrapper = mount(<MediaPickerComponents mediaState={pluginState} />);
      expect(wrapper.find(BrowserWrapper)).toHaveLength(0);
      expect(wrapper.find(BrowserComponent)).toHaveLength(0);
    });

    it('should render <BrowserWrapper /> component if mediaState.shouldUseMediaPickerPopup() is false', () => {
      pluginState.shouldUseMediaPickerPopup = jest.fn().mockReturnValue(false);
      wrapper = mount(<MediaPickerComponents mediaState={pluginState} />);
      expect(wrapper.find(BrowserWrapper)).toHaveLength(1);
      expect(wrapper.find(BrowserWrapper).prop('mediaState')).toBe(pluginState);
      expect(wrapper.find(BrowserComponent)).toHaveLength(1);
      expect(pluginState.setBrowseFn).toBeCalled();
    });
  });

  describe('<DropzoneWrapper />', () => {
    it('should render <DropzoneWrapper /> component', () => {
      wrapper = mount(<MediaPickerComponents mediaState={pluginState} />);
      expect(wrapper.find(DropzoneWrapper)).toHaveLength(1);
    });

    it('should set prop isActive=true to DropzoneWrapper when state.isPopupOpened=false', () => {
      wrapper = mount(<MediaPickerComponents mediaState={pluginState} />);
      wrapper.setState({
        isPopupOpened: true,
      });
      wrapper.setState({
        isPopupOpened: false,
      });
      expect(wrapper.find(DropzoneWrapper).prop('isActive')).toBeTruthy();
      expect(
        wrapper.find(DropzoneWrapper).find(DropzoneComponent),
      ).toHaveLength(1);
    });

    it('should set prop isActive=false to DropzoneWrapper when state.isPopupOpened=true', () => {
      wrapper = mount(<MediaPickerComponents mediaState={pluginState} />);
      wrapper.setState({
        isPopupOpened: true,
      });
      expect(wrapper.find(DropzoneWrapper).prop('isActive')).toBeFalsy();
      expect(
        wrapper.find(DropzoneWrapper).find(DropzoneComponent),
      ).toHaveLength(0);
    });
  });
});
