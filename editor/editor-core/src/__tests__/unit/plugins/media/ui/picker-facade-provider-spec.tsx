import { mount } from 'enzyme';
import React from 'react';

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

const mockMediaPickerFacade = jest.fn<typeof picker, Array<any>>(() => picker);

jest.mock(
  '../../../../../plugins/media/picker-facade',
  () => mockMediaPickerFacade,
);

import { MediaProvider } from '../../../../../plugins/media/pm-plugins/main';
import PickerFacadeProvider from '../../../../../plugins/media/ui/MediaPicker/PickerFacadeProvider';
import { getDefaultMediaClientConfig } from '@atlaskit/media-test-helpers';
import { ProviderFactory } from '@atlaskit/editor-common';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { ProviderHandler } from '@atlaskit/editor-common/src/provider-factory/types';
import { MediaPluginState } from '../../../../../plugins/media/pm-plugins/types';

describe('PickerFacadeProvider', () => {
  let pluginState: MediaPluginState;
  let provider: MediaProvider;
  const dummyMediaClientConfig = getDefaultMediaClientConfig();

  beforeEach(() => {
    pluginState = {} as MediaPluginState;
    provider = {} as MediaProvider;
    provider.uploadParams = {};
    provider.uploadMediaClientConfig = dummyMediaClientConfig;

    const providerFactory = new ProviderFactory();
    jest
      .spyOn(providerFactory, 'subscribe')
      .mockImplementation((_name: string, cb: ProviderHandler) => {
        cb(_name, Promise.resolve(provider));
      });

    providerFactory.unsubscribe = jest.fn();

    pluginState.insertFile = jest.fn();
    pluginState.options = {
      providerFactory,
      nodeViews: {},
      allowResizing: false,
    };
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'error');
  });

  afterEach(() => {
    (global.console.warn as jest.Mock).mockRestore();
    (global.console.error as jest.Mock).mockRestore();
    jest.clearAllMocks();
  });
  it('should initialize PickerFacade properly', done => {
    mount(
      <PickerFacadeProvider
        mediaState={pluginState}
        analyticsName="analyticsNameTest"
      >
        {({ mediaClientConfig, config, pickerFacadeInstance }) => {
          /**
           * This test cover the basic PickerFacade initialization for any use case of this class.
           * These are mainly use for any MediaPicker react component.
           * */
          expect(pickerFacadeInstance).toBe(picker);
          expect(mediaClientConfig).toBe(dummyMediaClientConfig);
          expect(config).toEqual({
            uploadParams: provider.uploadParams,
          });

          expect(mockMediaPickerFacade).toBeCalled();
          expect(mockMediaPickerFacade.mock.calls[0][0]).toBe(
            'customMediaPicker',
          );
          expect(picker.init).toBeCalled();

          expect(picker.onNewMedia).toBeCalledWith(pluginState.insertFile);
          expect(picker.setUploadParams).toBeCalledWith(provider.uploadParams);
          expect.assertions(8);
          done();
          return null;
        }}
      </PickerFacadeProvider>,
    );
  });

  it('should call pluginState.options.providerFactory.unsubscribe when component is unmounted', () => {
    const wrapper = mount(
      <PickerFacadeProvider
        mediaState={pluginState}
        analyticsName="analyticsNameTest"
      >
        {() => null}
      </PickerFacadeProvider>,
    );
    wrapper.unmount();
    expect(pluginState.options.providerFactory.unsubscribe).toBeCalled();
  });

  it('should not render children if mediaClientConfig is not defined', () => {
    provider.uploadMediaClientConfig = Promise.resolve() as any;
    const wrapper = mount(
      <PickerFacadeProvider
        mediaState={pluginState}
        analyticsName="analyticsNameTest"
      >
        {() => {
          throw new Error();
        }}
      </PickerFacadeProvider>,
    );
    expect(wrapper).toBeDefined();
    /* eslint-disable no-console */
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    /* eslint-enable no-console */
  });

  it('should not render children if config is not defined', () => {
    provider.uploadParams = undefined;
    const wrapper = mount(
      <PickerFacadeProvider
        mediaState={pluginState}
        analyticsName="analyticsNameTest"
      >
        {() => {
          throw new Error();
        }}
      </PickerFacadeProvider>,
    );
    expect(wrapper).toBeDefined();
    /* eslint-disable no-console */
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    /* eslint-enable no-console */
  });
});
