jest.mock('react-dom');
import { render } from 'react-dom';
import { PopupImpl } from '../../popup';
import { UploadParams, PopupConfig } from '../../../types';
import { fakeMediaClient } from '@atlaskit/media-test-helpers';

describe('MediaPickerPopup', () => {
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
