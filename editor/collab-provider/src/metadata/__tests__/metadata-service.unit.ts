import { MetadataService } from '../metadata-service';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { createSocketIOCollabProvider } from '../../socket-io-provider';
import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import type { Provider } from '../../';
import type { Metadata } from '@atlaskit/editor-common/collab';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';

const createMockService = () => {
  const providerEmitCallbackMock = jest.fn();
  const sendMetadataMock = jest.fn();

  const service = new MetadataService(
    providerEmitCallbackMock,
    sendMetadataMock,
  );

  return { service, providerEmitCallbackMock, sendMetadataMock };
};

describe('metadata-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('metadata', () => {
    it('Initializes metadata to an empty object', () => {
      const { service } = createMockService();
      expect(service.getMetaData()).toEqual({});
    });

    it('Does not emit metadata changed to provider when there is no difference in metadata ', () => {
      const { service, providerEmitCallbackMock } = createMockService();
      service.onMetadataChanged({ test: 'value' });
      expect(providerEmitCallbackMock).toBeCalledTimes(1);
      providerEmitCallbackMock.mockClear();
      service.onMetadataChanged({ test: 'value' });
      expect(providerEmitCallbackMock).not.toBeCalled();
    });

    it('updates and emits metadata when metadata differs to existing value', () => {
      const { service, providerEmitCallbackMock } = createMockService();
      service.onMetadataChanged({ aNew: 'value' });
      expect(providerEmitCallbackMock).toBeCalledWith('metadata:changed', {
        aNew: 'value',
      });
      expect(providerEmitCallbackMock).toBeCalledTimes(1);
      expect(service.getMetaData()).toEqual({ aNew: 'value' });
    });

    it('Sets the metadata when initialising a document', () => {
      const { service, providerEmitCallbackMock } = createMockService();
      service.updateMetadata({ isMeta: true });
      expect(service.getMetaData()).toEqual({ isMeta: true });
      expect(providerEmitCallbackMock).toBeCalledWith('metadata:changed', {
        isMeta: true,
      });
    });

    it('Updates metadata when calling setTitle', () => {
      const { service, sendMetadataMock } = createMockService();
      service.setTitle('newTitle');
      expect(service.getMetaData()).toEqual({ title: 'newTitle' });
      expect(sendMetadataMock).not.toBeCalled();
    });

    it('Updates and broadcasts metadata and when calling setTitle', () => {
      const { service, sendMetadataMock } = createMockService();
      service.setTitle('newTitle', true);
      expect(service.getMetaData()).toEqual({ title: 'newTitle' });
      expect(sendMetadataMock).toBeCalledWith({ title: 'newTitle' });
      expect(sendMetadataMock).toBeCalledTimes(1);
    });

    it('Updates metadata when calling setEditorWidth', () => {
      const { service, sendMetadataMock } = createMockService();
      service.setEditorWidth('newTitle');
      expect(service.getMetaData()).toEqual({ editorWidth: 'newTitle' });
      expect(sendMetadataMock).not.toBeCalled();
    });

    it('Updates and broadcasts metadata and when calling setEditorWidth', () => {
      const { service, sendMetadataMock } = createMockService();
      service.setEditorWidth('newTitle', true);
      expect(service.getMetaData()).toEqual({ editorWidth: 'newTitle' });
      expect(sendMetadataMock).toBeCalledTimes(1);
      expect(sendMetadataMock).toBeCalledWith({ editorWidth: 'newTitle' });
    });

    it('Updates and broadcasts metadata and when calling setMetadata', () => {
      const { service, sendMetadataMock } = createMockService();
      service.setMetadata({ isMeta: true });
      expect(service.getMetaData()).toEqual({ isMeta: true });
      expect(sendMetadataMock).toBeCalledWith({ isMeta: true });
      expect(sendMetadataMock).toBeCalledTimes(1);
    });
  });

  describe('updateMetadata', () => {
    it('Emits metadata:changed when metadata is included', () => {
      const { service, providerEmitCallbackMock } = createMockService();
      service.updateMetadata({ key: 'val' });
      expect(providerEmitCallbackMock).toBeCalledTimes(1);
      expect(providerEmitCallbackMock).toHaveBeenCalledWith(
        'metadata:changed',
        { key: 'val' },
      );
    });

    it('Does not emits metadata:changed when metadata is an empty object', () => {
      const { service, providerEmitCallbackMock } = createMockService();
      service.updateMetadata({});
      expect(providerEmitCallbackMock).toBeCalledTimes(0);
    });
  });

  describe('provider send data', () => {
    let provider: Provider;
    let anyEditorState: EditorState;
    let metadataServiceSendMetaSpy: jest.SpyInstance;
    let fakeAnalyticsWebClient: AnalyticsWebClient;
    const documentAri = 'ari:cloud:confluence:ABC:page/testpage';
    beforeEach(() => {
      jest.useFakeTimers();

      fakeAnalyticsWebClient = {
        sendOperationalEvent: jest.fn(),
        sendScreenEvent: jest.fn(),
        sendTrackEvent: jest.fn(),
        sendUIEvent: jest.fn(),
      };
      const testProviderConfigWithAnalytics = {
        url: `http://provider-url:6661`,
        documentAri: documentAri,
        analyticsClient: fakeAnalyticsWebClient,
      };
      provider = createSocketIOCollabProvider(testProviderConfigWithAnalytics);

      metadataServiceSendMetaSpy = jest.spyOn(
        // @ts-ignore
        provider.metadataService as any,
        'broadcastMetadata',
      );

      const { collab: collabPlugin } = jest.requireActual(
        '@atlaskit/prosemirror-collab',
      );
      anyEditorState = createEditorState(
        doc(p('lol')),
        collabPlugin({ clientID: 3771180701 }),
      );

      const getStateMock = () => anyEditorState;
      provider.initialize(getStateMock);
    });

    it('should broadcast metadata when sendMetadata is called', () => {
      const metadata: Metadata = {
        title: 'abc',
      };
      provider.setMetadata(metadata);
      expect(metadataServiceSendMetaSpy).toHaveBeenCalledWith(metadata);
    });
  });
});
