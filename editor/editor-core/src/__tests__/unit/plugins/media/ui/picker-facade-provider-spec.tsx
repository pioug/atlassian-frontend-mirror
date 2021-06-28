import * as mocks from './picker-facade-provider-spec.mock';
import { mount } from 'enzyme';
import React from 'react';

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
  it('should initialize PickerFacade properly', (done) => {
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
          expect(pickerFacadeInstance).toBe(mocks.picker);
          expect(mediaClientConfig).toBe(dummyMediaClientConfig);
          expect(config).toEqual({
            uploadParams: provider.uploadParams,
          });

          expect(mocks.mockMediaPickerFacade).toBeCalled();
          expect(mocks.mockMediaPickerFacade.mock.calls[0][0]).toBe(
            'customMediaPicker',
          );
          expect(mocks.picker.init).toBeCalled();

          expect(mocks.picker.onNewMedia).toBeCalledWith(
            pluginState.insertFile,
          );
          expect(mocks.picker.setUploadParams).toBeCalledWith(
            provider.uploadParams,
          );
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
