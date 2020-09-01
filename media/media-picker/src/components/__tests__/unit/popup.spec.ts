jest.mock('react-dom');
import { render } from 'react-dom';
import { PopupImpl } from '../../popup';
import { UploadParams, PopupConfig } from '../../../types';
import { fakeMediaClient } from '@atlaskit/media-test-helpers';
import { MediaFeatureFlags } from '@atlaskit/media-common/mediaFeatureFlags';

describe('MediaPickerPopup', () => {
  const featureFlags = {} as MediaFeatureFlags;

  const mediaClient = fakeMediaClient({
    authProvider: () =>
      Promise.resolve({
        clientId: '',
        token: '',
        baseUrl: 'some-api-url',
      }),
    userAuthProvider: () =>
      Promise.resolve({
        clientId: 'some-client-id',
        token: 'some-token',
        baseUrl: 'some-api-url',
      }),
  });
  const popupConfig: PopupConfig = {
    uploadParams: {
      collection: '',
    },
    featureFlags,
  };

  beforeEach(() => {
    (render as jest.Mock).mockReset();
  });

  describe('constructor', () => {
    it('sets uploadParams to the default when none are supplied', () => {
      const mediaPicker = new PopupImpl(mediaClient, popupConfig);

      const expectedUploadParams: UploadParams = {
        collection: '',
      };
      expect(
        (mediaPicker as any)['tenantUploadParams'] as UploadParams,
      ).toEqual(expectedUploadParams);
    });

    it('merges uploadParams with the defaults when they are supplied', () => {
      const newUploadParams: UploadParams = {
        collection: 'hello-world',
      };
      const mediaPicker = new PopupImpl(mediaClient, {
        ...popupConfig,
        uploadParams: newUploadParams,
      });

      expect(
        (mediaPicker as any)['tenantUploadParams'] as UploadParams,
      ).toEqual({
        collection: 'hello-world',
      });
    });
  });

  describe('show', () => {
    it('should fetch Forge plugins when useForgePlugins=true', () => {
      const mediaPickerWithoutForge = new PopupImpl(mediaClient, popupConfig);
      const dispatchSpy = jest.spyOn(
        (mediaPickerWithoutForge as any).store,
        'dispatch',
      );

      mediaPickerWithoutForge.show();
      expect(dispatchSpy).toHaveBeenCalledTimes(2);

      const mediaPickerWihtForge = new PopupImpl(mediaClient, {
        ...popupConfig,
        useForgePlugins: true,
      });
      const dispatchSpyForge = jest.spyOn(
        (mediaPickerWihtForge as any).store,
        'dispatch',
      );

      mediaPickerWihtForge.show();
      expect(dispatchSpyForge).toHaveBeenCalledTimes(3);
      expect(dispatchSpyForge).toBeCalledWith({
        type: 'GET_FORGE_PLUGINS',
      });
    });
  });

  describe('setUploadParams', () => {
    it('updates collection uploadParam when it is supplied', () => {
      const collection = 'some-collection-name';
      const newUploadParams: UploadParams = { collection };

      const mediaPicker = new PopupImpl(mediaClient, popupConfig);
      mediaPicker.setUploadParams(newUploadParams);

      expect(
        ((mediaPicker as any)['tenantUploadParams'] as UploadParams).collection,
      ).toEqual(collection);
    });
  });

  describe('hide', () => {
    it('fires a closed event when the popup is hidden', () => {
      const mediaPicker = new PopupImpl(mediaClient, popupConfig);
      const emitSpy = jest.fn();

      mediaPicker.emit = emitSpy;

      mediaPicker.hide();
      expect(emitSpy).toHaveBeenCalled();
      expect(emitSpy.mock.calls[0][0]).toEqual('closed');
    });
  });

  describe('render', () => {
    it('should render <App /> with the right properties', () => {
      const mediaPicker = new PopupImpl(mediaClient, popupConfig) as any;

      expect((render as jest.Mock).mock.calls[0][0].props).toEqual({
        featureFlags,
        proxyReactContext: undefined,
        store: mediaPicker.store,
        tenantUploadParams: {
          collection: '',
        },
        useForgePlugins: false,
      });
    });

    it('should render <App /> with passed featureFlags', () => {
      const mediaPicker = new PopupImpl(mediaClient, popupConfig) as any;
      expect((render as jest.Mock).mock.calls[0][0].props).toEqual({
        featureFlags,
        proxyReactContext: undefined,
        store: mediaPicker.store,
        tenantUploadParams: {
          collection: '',
        },
        useForgePlugins: false,
      });
    });
  });
});
