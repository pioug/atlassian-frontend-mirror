import { ContextIdentifierProvider } from '@atlaskit/editor-common';
import { EditorView } from 'prosemirror-view';
/**
 * TS 3.9+ defines non-configurable property for exports, that's why it's not possible to mock them like this anymore:
 *
 * ```
 * import * as tableUtils from '../../../../../plugins/table/utils';
 * jest.spyOn(tableUtils, 'getColumnsWidths')
 * ```
 *
 * This is a workaround: https://github.com/microsoft/TypeScript/issues/38568#issuecomment-628637477
 */
jest.mock('@atlaskit/media-client', () => ({
  __esModule: true,
  ...jest.requireActual<Object>('@atlaskit/media-client'),
}));
import * as MediaClientModule from '@atlaskit/media-client';
import { FileState, getMediaClient } from '@atlaskit/media-client';
import {
  asMock,
  asMockReturnValue,
  fakeMediaClient,
  getDefaultMediaClientConfig,
} from '@atlaskit/media-test-helpers';
import { MediaClientConfig } from '@atlaskit/media-core';
import * as commands from '../../../../../plugins/media/commands/helpers';
import {
  MediaNodeUpdater,
  MediaNodeUpdaterProps,
} from '../../../../../plugins/media/nodeviews/mediaNodeUpdater';
import { MediaProvider } from '../../../../../plugins/media/pm-plugins/main';
import {
  replaceExternalMedia,
  updateAllMediaNodesAttrs,
  updateMediaNodeAttrs,
} from '../../../../../plugins/media/commands/helpers';

describe('MediaNodeUpdater', () => {
  afterEach(() => jest.resetAllMocks());

  const setup = (props?: Partial<MediaNodeUpdaterProps>) => {
    const mediaClient = fakeMediaClient();
    jest
      .spyOn(MediaClientModule, 'getMediaClient')
      .mockReturnValue(mediaClient);
    jest
      .spyOn(commands, 'updateAllMediaNodesAttrs')
      .mockReturnValue(() => true);
    jest.spyOn(commands, 'updateMediaNodeAttrs').mockReturnValue(() => true);
    jest.spyOn(commands, 'replaceExternalMedia').mockReturnValue(() => true);

    const contextIdentifierProvider: Promise<ContextIdentifierProvider> = Promise.resolve(
      {
        containerId: '',
        objectId: 'object-id',
      },
    );
    const viewMediaClientConfig = getDefaultMediaClientConfig();
    const authFromContext = Promise.resolve({
      clientId: 'auth-context-client-id',
      token: 'auth-context-token',
      baseUrl: 'some-service-host',
    });
    const uploadMediaClientConfig: MediaClientConfig = {
      ...getDefaultMediaClientConfig(),
      getAuthFromContext: jest.fn().mockReturnValue(authFromContext),
    };
    const mediaProvider: Promise<MediaProvider> = Promise.resolve({
      viewMediaClientConfig,
      uploadMediaClientConfig,
      uploadParams: {
        collection: 'destination-collection',
      },
    });
    const node: any = {
      attrs: {
        id: 'source-file-id',
        collection: 'source-collection',
        __contextId: 'source-context-id',
        type: 'file',
      },
    };
    const mediaNodeUpdater = new MediaNodeUpdater({
      view: {} as EditorView,
      node,
      contextIdentifierProvider,
      mediaProvider,
      isMediaSingle: true,
      ...props,
    });

    return {
      mediaNodeUpdater,
      mediaClient,
      uploadMediaClientConfig,
      authFromContext,
    };
  };

  describe('updateContextId()', () => {
    it('should update node attrs with contextId', async () => {
      const { mediaNodeUpdater } = setup();

      await mediaNodeUpdater.updateContextId();

      expect(updateAllMediaNodesAttrs).toBeCalledTimes(1);
      expect(updateAllMediaNodesAttrs).toBeCalledWith(
        'source-file-id',
        {
          __contextId: 'object-id',
        },
        true,
      );
    });
  });

  describe('updateFileAttrs()', () => {
    it('should update node attrs with file attributes', async () => {
      const { mediaNodeUpdater } = setup();

      const mediaClient = fakeMediaClient();

      const fileState: Partial<FileState> = {
        size: 10,
        name: 'some-file',
        mimeType: 'image/jpeg',
      };

      asMock(mediaClient.file.getCurrentState).mockReturnValue(
        Promise.resolve(fileState),
      );

      asMockReturnValue(getMediaClient, mediaClient);

      await mediaNodeUpdater.updateFileAttrs();

      expect(mediaClient.file.getCurrentState).toBeCalledWith(
        'source-file-id',
        {
          collectionName: 'source-collection',
        },
      );
      expect(updateAllMediaNodesAttrs).toBeCalledTimes(1);
      expect(updateAllMediaNodesAttrs).toBeCalledWith(
        'source-file-id',
        {
          __fileName: 'some-file',
          __fileMimeType: 'image/jpeg',
          __fileSize: 10,
          __contextId: 'source-context-id',
        },
        true,
      );
    });

    it('should update contextId if its not defined', async () => {
      const node: any = {
        attrs: {
          id: 'source-file-id',
          collection: 'source-collection',
          type: 'file',
        },
      };
      const { mediaNodeUpdater } = setup({
        node,
      });
      const mediaClient = fakeMediaClient();
      const fileState: Partial<FileState> = {
        size: 10,
        name: 'some-file',
        mimeType: 'image/jpeg',
      };

      asMock(mediaClient.file.getCurrentState).mockReturnValue(
        Promise.resolve(fileState),
      );

      asMockReturnValue(getMediaClient, mediaClient);

      await mediaNodeUpdater.updateFileAttrs();

      expect(mediaClient.file.getCurrentState).toBeCalledWith(
        'source-file-id',
        {
          collectionName: 'source-collection',
        },
      );
      expect(updateAllMediaNodesAttrs).toBeCalledTimes(1);
      expect(updateAllMediaNodesAttrs).toBeCalledWith(
        'source-file-id',
        {
          __fileName: 'some-file',
          __fileMimeType: 'image/jpeg',
          __fileSize: 10,
          __contextId: 'object-id',
        },
        true,
      );
    });

    it('should not update node if new attrs are the same', async () => {
      const { mediaNodeUpdater } = setup();
      const mediaClient = fakeMediaClient();
      const fileState: Partial<FileState> = {
        id: 'source-file-id',
      };

      asMock(mediaClient.file.getCurrentState).mockReturnValue(
        Promise.resolve(fileState),
      );
      asMockReturnValue(getMediaClient, mediaClient);
      await mediaNodeUpdater.updateFileAttrs();
      expect(updateAllMediaNodesAttrs).not.toBeCalled();
    });

    it('should not update node if media client rejects with error', async () => {
      const { mediaNodeUpdater } = setup();
      const mediaClient = fakeMediaClient();

      asMock(mediaClient.file.getCurrentState).mockReturnValue(
        Promise.reject(new Error('an error')),
      );
      asMockReturnValue(getMediaClient, mediaClient);
      await mediaNodeUpdater.updateFileAttrs();
      expect(updateAllMediaNodesAttrs).not.toBeCalled();
    });
  });

  describe('isNodeFromDifferentCollection()', () => {
    it('should return true if origin collection and destination collection are different', () => {
      const { mediaNodeUpdater } = setup();

      expect(mediaNodeUpdater.isNodeFromDifferentCollection()).toBeTruthy();
    });
  });

  describe('hasDifferentContextId()', () => {
    it('should return true if current node context id is different than page context id', async () => {
      const { mediaNodeUpdater } = setup();

      expect(mediaNodeUpdater.getNodeContextId()).toEqual('source-context-id');
      expect(await mediaNodeUpdater.getObjectId()).toEqual('object-id');
      expect(await mediaNodeUpdater.hasDifferentContextId()).toBeTruthy();
    });

    it('should return false if current node context id is the same as page context id', async () => {
      const { mediaNodeUpdater } = setup({
        node: {
          attrs: {
            id: 'some-source-file-id',
            collection: 'source-collection',
            __contextId: 'object-id',
            type: 'file',
          },
        } as any,
      });

      expect(mediaNodeUpdater.getNodeContextId()).toEqual('object-id');
      expect(await mediaNodeUpdater.getObjectId()).toEqual('object-id');
      expect(await mediaNodeUpdater.hasDifferentContextId()).toBeFalsy();
    });
  });

  describe('copyNode()', () => {
    it('should use getAuthFromContext to get auth', async () => {
      const { mediaNodeUpdater, uploadMediaClientConfig } = setup();

      await mediaNodeUpdater.copyNode();
      expect(uploadMediaClientConfig.getAuthFromContext).toBeCalledTimes(1);
      expect(uploadMediaClientConfig.getAuthFromContext).toBeCalledWith(
        'source-context-id',
      );
    });

    it('should call copyFile with right source and destination', async () => {
      const {
        mediaNodeUpdater,
        mediaClient,
        uploadMediaClientConfig,
        authFromContext,
      } = setup();

      await mediaNodeUpdater.copyNode();
      expect(mediaClient.file.copyFile).toBeCalledTimes(1);
      expect(mediaClient.file.copyFile).toBeCalledWith(
        {
          id: 'source-file-id',
          collection: 'source-collection',
          authProvider: expect.anything(),
        },
        {
          collection: 'destination-collection',
          authProvider: uploadMediaClientConfig.authProvider,
          occurrenceKey: expect.anything(),
        },
      );
      const authProvider = (mediaClient.file.copyFile as jest.Mock).mock
        .calls[0][0].authProvider;
      expect(authProvider()).toEqual(authFromContext);
    });

    it('should update media node attrs with the new id', async () => {
      const { mediaNodeUpdater } = setup({ isMediaSingle: false });

      await mediaNodeUpdater.copyNode();

      expect(updateMediaNodeAttrs).toBeCalledTimes(1);
      expect(updateMediaNodeAttrs).toBeCalledWith(
        'source-file-id',
        {
          id: 'copied-file-id',
          collection: 'destination-collection',
          __contextId: 'object-id',
        },
        false,
      );
    });
  });

  describe('copyNodeFromBlobUrl()', () => {
    it('should use url params to copy file', async () => {
      const externalNode: any = {
        attrs: {
          url:
            'blob:http://localhost/blob_id#media-blob-url=true&id=file_id&collection=collection_name&contextId=context_id&width=10&height=20&mimeType=image%2Fjpeg&size=10&name=file_name',
          type: 'external',
        },
      };
      const { mediaNodeUpdater } = setup({
        node: externalNode,
      });

      await mediaNodeUpdater.copyNodeFromBlobUrl(jest.fn().mockReturnValue(1));

      expect(replaceExternalMedia).toBeCalledTimes(1);
      expect(replaceExternalMedia).toBeCalledWith(2, {
        id: 'copied-file-id',
        collection: 'destination-collection',
        width: 10,
        height: 20,
        __fileName: 'file_name',
        __fileMimeType: 'image/jpeg',
        __fileSize: 10,
      });
    });
  });

  describe('getRemoteDimensions()', () => {
    it('should call getImageMetadata when file has an image representation', async () => {
      const { mediaNodeUpdater } = setup();

      const mediaClient = fakeMediaClient();
      asMockReturnValue(getMediaClient, mediaClient);

      for (const status of ['processing', 'processed', 'failed-processing']) {
        asMock(mediaClient.file.getCurrentState).mockReturnValueOnce(
          Promise.resolve({
            id: 'source-file-id',
            status,
            representations: { image: {} },
          }),
        );

        await mediaNodeUpdater.getRemoteDimensions();
      }

      expect(mediaClient.file.getCurrentState).toHaveBeenCalledTimes(3);
      expect(mediaClient.getImageMetadata).toHaveBeenCalledTimes(3);
    });

    it('should not call getImageMetadata when file has no image representation', async () => {
      const { mediaNodeUpdater } = setup();

      const mediaClient = fakeMediaClient();
      asMockReturnValue(getMediaClient, mediaClient);

      for (const status of [
        'uploading',
        'processing',
        'processed',
        'failed-processing',
        'error',
      ]) {
        asMock(mediaClient.file.getCurrentState).mockReturnValueOnce(
          Promise.resolve({
            id: 'source-file-id',
            status,
            representation: status !== 'error' ? {} : undefined,
          }),
        );

        await mediaNodeUpdater.getRemoteDimensions();
      }

      expect(mediaClient.file.getCurrentState).toHaveBeenCalledTimes(5);
      expect(mediaClient.getImageMetadata).toHaveBeenCalledTimes(0);
    });
  });
});
