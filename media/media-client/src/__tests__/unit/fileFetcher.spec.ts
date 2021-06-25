import { combineLatest } from 'rxjs/observable/combineLatest';
import { authToOwner, AuthProvider } from '@atlaskit/media-core';
import fetchMock from 'fetch-mock/cjs/client';
import {
  ResponseFileItem,
  MediaFile,
  MediaStore,
  RECENTS_COLLECTION,
  globalMediaEventEmitter,
  MediaViewedEventPayload,
  getFileStreamsCache,
  uploadFile,
  UploadableFile,
  UploadableFileUpfrontIds,
  UploadController,
  FilePreview,
  isPreviewableFileState,
  isErrorFileState,
  isFileFetcherError,
  FileFetcherError,
} from '../..';
import uuid from 'uuid';
import { UploadFileCallbacks } from '../../uploader';
import { FileFetcherImpl } from '../../client/file-fetcher';
import {
  expectFunctionToHaveBeenCalledWith,
  asMock,
  asMockFunction,
  asMockFunctionResolvedValue,
  fakeMediaClient,
  sleep,
  timeoutPromise,
} from '@atlaskit/media-test-helpers';
import { observableToPromise } from '../../utils/observableToPromise';
import { isMimeTypeSupportedByServer } from '@atlaskit/media-common/mediaTypeUtils';
import * as MediaStoreModule from '../../client/media-store';

jest.mock('../../utils/getDimensionsFromBlob', () => {
  return {
    getDimensionsFromBlob: () => {
      return { width: 1, height: 1 };
    },
  };
});

jest.mock('../../uploader');

describe('FileFetcher', () => {
  const fileId = 'some-file-id';
  const collectionName = 'some-collection-name';
  const fileName = 'some-name';
  const binaryUrl = 'http://some-binary-url.com/';

  const setup = () => {
    getFileStreamsCache().removeAll();

    const items: ResponseFileItem[] = [
      {
        id: uuid(),
        type: 'file',
        collection: 'collection-1',
        details: {
          name: 'file-1',
          mimeType: 'image/jpeg',
          mediaType: 'image',
          processingStatus: 'pending',
          size: 0,
          artifacts: {},
          representations: {},
        },
      },
      {
        id: uuid(),
        type: 'file',
        collection: 'collection-1',
        details: {
          name: 'file-2',
          mimeType: 'image/jpeg',
          mediaType: 'image',
          processingStatus: 'pending',
          size: 0,
          artifacts: {},
          representations: {},
        },
      },
      {
        id: uuid(),
        type: 'file',
        collection: 'collection-2',
        details: {
          name: 'file-3',
          mimeType: 'image/jpeg',
          mediaType: 'image',
          processingStatus: 'pending',
          size: 0,
          artifacts: {},
          representations: {},
        },
      },
    ];

    const createUploadableFile = (
      name: string,
      mimeType: string,
      collection?: string,
    ): UploadableFile => ({
      content: new Blob([], { type: mimeType }),
      name,
      mimeType,
      collection,
    });

    const uploadFileUpfrontIds: UploadableFileUpfrontIds = {
      id: 'upfront-id',
      deferredUploadId: Promise.resolve('deferred-upload-id'),
      occurrenceKey: 'upfront-occurrence-key',
    };

    asMockFunction(uploadFile).mockImplementation(
      (
        _1: UploadableFile,
        _2: MediaStore,
        _3: UploadableFileUpfrontIds,
        callbacks?: UploadFileCallbacks,
      ) => {
        if (callbacks) {
          callbacks.onProgress(0);
          callbacks.onProgress(0.5);
          callbacks.onProgress(1);
          callbacks.onUploadFinish();
        }

        return {
          cancel: jest.fn(),
        };
      },
    );

    const mediaClient = fakeMediaClient();
    const mediaStore = {
      ...mediaClient.mediaStore,
      getFileBinaryURL: asMockFunctionResolvedValue(
        mediaClient.mediaStore.getFileBinaryURL,
        binaryUrl,
      ),
      getItems: asMockFunctionResolvedValue(mediaClient.mediaStore.getItems, {
        data: {
          items,
        },
      }),
    } as jest.Mocked<MediaStore>;

    const fileFetcher = new FileFetcherImpl(mediaStore);

    (fileFetcher as any).generateUploadableFileUpfrontIds = jest
      .fn()
      .mockReturnValue({
        id: 'upfront-id',
        occurrenceKey: 'upfront-occurrence-key',
      });

    const mockAuthProvider: jest.Mocked<AuthProvider> = jest
      .fn()
      .mockResolvedValue({
        clientId: 'some-client-id',
        token: 'some-token',
        baseUrl: 'some-service-host',
      });

    return {
      fileFetcher,
      mediaStore,
      items,
      createUploadableFile,
      uploadFileUpfrontIds,
      mockAuthProvider,
    };
  };

  const MockMediaStoreConstructor = (jest.genMockFromModule(
    '../../client/media-store',
  ) as typeof MediaStoreModule)['MediaStore'];

  const createMockMediaStore = (authProvider: AuthProvider) =>
    new MockMediaStoreConstructor({
      authProvider,
    });

  beforeEach(() => {
    jest.spyOn(globalMediaEventEmitter, 'emit');
  });

  afterEach(() => {
    getFileStreamsCache().removeAll();
    jest.restoreAllMocks();
    fetchMock.restore();
  });

  describe('downloadBinary()', () => {
    let appendChild: jest.SpyInstance<any>;

    describe('with normal browser', () => {
      beforeEach(() => {
        appendChild = jest.spyOn(document.body, 'appendChild');
      });

      it('should trigger media-viewed in globalMediaEventEmitter for recents collection', async () => {
        const { fileFetcher } = setup();
        await fileFetcher.downloadBinary(fileId, fileName, RECENTS_COLLECTION);

        expect(globalMediaEventEmitter.emit).toHaveBeenCalledTimes(1);
        expectFunctionToHaveBeenCalledWith(globalMediaEventEmitter.emit, [
          'media-viewed',
          {
            fileId,
            viewingLevel: 'download',
            isUserCollection: true,
          } as MediaViewedEventPayload,
        ]);
      });

      it('should trigger media-viewed in globalMediaEventEmitter for non-recents collection', async () => {
        const { fileFetcher } = setup();
        await fileFetcher.downloadBinary(fileId, fileName, collectionName);

        expect(globalMediaEventEmitter.emit).toHaveBeenCalledTimes(1);
        expectFunctionToHaveBeenCalledWith(globalMediaEventEmitter.emit, [
          'media-viewed',
          {
            fileId,
            viewingLevel: 'download',
            isUserCollection: false,
          } as MediaViewedEventPayload,
        ]);
      });

      it('should not trigger media-viewed in globalMediaEventEmitter if getFileBinaryURL fails', async () => {
        const { fileFetcher, mediaStore } = setup();
        asMock(mediaStore.getFileBinaryURL).mockRejectedValue(new Error());
        try {
          await fileFetcher.downloadBinary(fileId, fileName, collectionName);
        } catch {
          expect(globalMediaEventEmitter.emit).toHaveBeenCalledTimes(0);
        }
        expect.assertions(1);
      });

      it('should call getFileBinaryURL', () => {
        const { mediaStore, fileFetcher } = setup();
        fileFetcher.downloadBinary(fileId, fileName, collectionName);
        expect(mediaStore.getFileBinaryURL).toHaveBeenCalledWith(
          fileId,
          collectionName,
        );
      });

      it('should create a link', async () => {
        const { fileFetcher } = setup();
        await fileFetcher.downloadBinary(fileId, fileName, collectionName);
        const lastAppendCall =
          appendChild.mock.calls[appendChild.mock.calls.length - 1];
        const link = lastAppendCall[0] as HTMLAnchorElement;
        expect(link.download).toBe(fileName);
        expect(link.href).toBe(binaryUrl);
        expect(link.target).toBe('media-download-iframe');
      });

      it('should create iframe and open binary url in it', () => {
        const { fileFetcher } = setup();
        fileFetcher.downloadBinary(fileId, fileName, collectionName);

        const iframe = document.getElementById(
          'media-download-iframe',
        ) as HTMLIFrameElement;
        expect(iframe).toBeDefined();
      });
    });

    describe('with IE11', () => {
      beforeEach(() => {
        const { fileFetcher } = setup();
        appendChild = jest.spyOn(document.body, 'appendChild');
        (window as any).MSInputMethodContext = true;
        (document as any).documentMode = true;
        fileFetcher.downloadBinary(fileId, fileName, collectionName);
      });

      it('should detect IE11 and use _blank as target', () => {
        const lastAppendCall =
          appendChild.mock.calls[appendChild.mock.calls.length - 1];
        const link = lastAppendCall[0] as HTMLAnchorElement;
        expect(link.target).toBe('_blank');
      });
    });
  });

  describe('getFileState()', () => {
    it('should return an errored observable if we pass an invalid file id', (done) => {
      const { fileFetcher } = setup();

      fileFetcher
        .getFileState('invalid-id', {
          collectionName: 'collection',
          occurrenceKey: 'occurrence-key',
        })
        .subscribe({
          error(error) {
            if (!isFileFetcherError(error)) {
              return expect(isFileFetcherError(error)).toBeTruthy();
            }
            expect(error.attributes).toEqual({
              reason: 'invalidFileId',
              id: 'invalid-id',
              collectionName: 'collection',
              occurrenceKey: 'occurrence-key',
            });
            done();
          },
        });
    });

    it('should split calls to /items by collection name', (done) => {
      const { fileFetcher, mediaStore, items } = setup();

      combineLatest(
        fileFetcher.getFileState(items[0].id, {
          collectionName: items[0].collection,
        }),
        fileFetcher.getFileState(items[1].id, {
          collectionName: items[1].collection,
        }),
        fileFetcher.getFileState(items[2].id, {
          collectionName: items[2].collection,
        }),
      ).subscribe(([fileState1, fileState2, fileState3]) => {
        expect(fileState1.id).toEqual(items[0].id);
        expect(fileState2.id).toEqual(items[1].id);
        expect(fileState3.id).toEqual(items[2].id);

        expect(mediaStore.getItems).toHaveBeenCalledTimes(2);
        expect(mediaStore.getItems.mock.calls[0]).toEqual([
          [items[0].id, items[1].id],
          'collection-1',
        ]);
        expect(mediaStore.getItems.mock.calls[1]).toEqual([
          [items[2].id],
          'collection-2',
        ]);
        done();
      });
    });

    it('should group ids without collection in the same call to /items', (done) => {
      const { fileFetcher, mediaStore, items } = setup();

      // omit collection from original response
      asMockFunctionResolvedValue(mediaStore.getItems, {
        data: {
          items: items.map((item) => ({
            id: item.id,
            type: item.type,
            details: item.details,
          })),
        },
      });

      combineLatest(
        fileFetcher.getFileState(items[0].id),
        fileFetcher.getFileState(items[1].id),
        fileFetcher.getFileState(items[2].id),
      ).subscribe(([fileState1, fileState2, fileState3]) => {
        expect(fileState1.id).toEqual(items[0].id);
        expect(fileState2.id).toEqual(items[1].id);
        expect(fileState3.id).toEqual(items[2].id);

        expect(mediaStore.getItems).toHaveBeenCalledTimes(1);
        expect(mediaStore.getItems.mock.calls[0]).toEqual([
          [items[0].id, items[1].id, items[2].id],
          undefined,
        ]);
        done();
      });
    });

    it('should handle failures when fetching items', async (done) => {
      const { fileFetcher, mediaStore, items } = setup();
      const next = jest.fn();
      const error = jest.fn();

      mediaStore.getItems.mockImplementation(
        (_: string[], collectionName?: string) => {
          // We want to make one of the /items call to fail
          if (collectionName === 'collection-1') {
            return Promise.reject(new Error('any error'));
          }

          return Promise.resolve({
            data: {
              items: [items[2]],
            },
          });
        },
      );

      fileFetcher
        .getFileState(items[0].id, { collectionName: items[0].collection })
        .subscribe({
          error,
        });

      fileFetcher
        .getFileState(items[2].id, { collectionName: items[2].collection })
        .subscribe({
          next,
        });

      setImmediate(() => {
        expect(error).toBeCalledTimes(1);
        expect(next).toBeCalledTimes(1);
        expect(mediaStore.getItems).toHaveBeenCalledTimes(2);
        expect(error).toBeCalledWith(expect.any(Error));
        expect(next).toBeCalledWith({
          id: items[2].id,
          status: 'processing',
          name: 'file-3',
          mimeType: 'image/jpeg',
          mediaType: 'image',
          size: 0,
          artifacts: {},
          representations: {},
        });

        done();
      });
    });

    it('should create emptyItems error when no item returned', async (done) => {
      const { fileFetcher, mediaStore, items } = setup();

      mediaStore.getItems.mockImplementation(() =>
        Promise.resolve({
          data: {
            items: [], // no item
          },
        }),
      );

      fileFetcher
        .getFileState(items[0].id, { collectionName: items[0].collection })
        .subscribe({
          error: (err) => {
            expect(err).toBeInstanceOf(FileFetcherError);
            expect(err.attributes.reason).toEqual('emptyItems');
            expect(err.attributes.id).toEqual(items[0].id);
            expect(err.attributes.collectionName).toEqual(items[0].collection);
            done();
          },
        });

      expect.assertions(4);
    });

    it('should return processing file state for empty files', async (done) => {
      const { fileFetcher, mediaStore, items } = setup();
      const next = jest.fn();
      const error = jest.fn();

      asMockFunctionResolvedValue(mediaStore.getItems, {
        data: {
          items: [
            {
              id: items[0].id,
              type: 'file',
              collection: items[0].collection,
              details: {
                name: items[0].details.name,
                mimeType: items[0].details.mimeType,
                mediaType: items[0].details.mediaType,
                processingStatus: items[0].details.processingStatus,
                size: 0,
                artifacts: {},
                representations: {},
              },
            },
          ],
        },
      });

      fileFetcher
        .getFileState(items[0].id, { collectionName: items[0].collection })
        .subscribe({
          next,
          error,
        });

      setImmediate(() => {
        expect(next).toBeCalledTimes(1);
        expect(error).toBeCalledTimes(0);
        expect(next).toBeCalledWith({
          id: items[0].id,
          status: 'processing',
          name: 'file-1',
          mimeType: 'image/jpeg',
          mediaType: 'image',
          size: 0,
          artifacts: {},
          representations: {},
        });

        done();
      });
    });
  });

  describe('copyFile', () => {
    it('should call mediaStore.copyFileWithToken', async () => {
      const { items, fileFetcher, mockAuthProvider } = setup();
      const copyFileWithTokenMock = jest
        .fn()
        .mockResolvedValue({ data: { mimeType: 'application/octet-stream' } });
      const userAuthProvider = jest.fn();
      const mediaStore = createMockMediaStore(userAuthProvider);

      mediaStore.copyFileWithToken = copyFileWithTokenMock;

      const destinationAuthProvider = jest.fn();

      const source = {
        id: items[0].id,
        collection: 'someCollectionName',
        authProvider: mockAuthProvider,
      };
      const destination = {
        collection: RECENTS_COLLECTION,
        authProvider: destinationAuthProvider,
        mediaStore,
      };
      await fileFetcher.copyFile(source, destination);
      expectFunctionToHaveBeenCalledWith(copyFileWithTokenMock, [
        {
          sourceFile: {
            id: items[0].id,
            collection: 'someCollectionName',
            owner: authToOwner(await mockAuthProvider()),
          },
        },
        {
          collection: RECENTS_COLLECTION,
        },
      ]);
    });

    it('should populate cache when copied file "processingStatus" is succeeded', async () => {
      const { items, fileFetcher, mockAuthProvider } = setup();
      const copiedFile: MediaFile = {
        id: 'copied-file-id',
        name: 'copied-file-name',
        processingStatus: 'succeeded',
        artifacts: {},
        mediaType: 'archive',
        mimeType: 'application/zip',
        representations: {},
        size: 1,
        createdAt: -1,
      };
      const mediaStore = createMockMediaStore(jest.fn());
      asMock(mediaStore.copyFileWithToken).mockResolvedValue({
        data: copiedFile,
      });
      const source = {
        id: items[0].id,
        collection: 'someCollectionName',
        authProvider: mockAuthProvider,
      };
      const destination = {
        collection: RECENTS_COLLECTION,
        authProvider: mockAuthProvider,
        mediaStore,
      };

      await fileFetcher.copyFile(source, destination);

      const copiedFileObservable = getFileStreamsCache().get('copied-file-id');
      if (!copiedFileObservable) {
        return expect(copiedFileObservable).toBeDefined();
      }

      const copiedFileState = await observableToPromise(copiedFileObservable);
      expect(copiedFileState).toEqual({
        id: 'copied-file-id',
        name: 'copied-file-name',
        status: 'processed',
        artifacts: {},
        mediaType: 'archive',
        mimeType: 'application/zip',
        representations: {},
        size: 1,
        createdAt: -1,
      });
    });

    it('should populate cache when copied file "processingStatus" is failed', async () => {
      const { items, fileFetcher, mockAuthProvider } = setup();
      const copiedFile: MediaFile = {
        id: 'copied-file-id',
        name: 'copied-file-name',
        processingStatus: 'failed',
        artifacts: {},
        mediaType: 'archive',
        mimeType: 'application/zip',
        representations: {},
        size: 1,
        createdAt: -1,
      };
      const mediaStore = createMockMediaStore(jest.fn());
      asMock(mediaStore.copyFileWithToken).mockResolvedValue({
        data: copiedFile,
      });
      const source = {
        id: items[0].id,
        collection: 'someCollectionName',
        authProvider: mockAuthProvider,
      };
      const destination = {
        collection: RECENTS_COLLECTION,
        authProvider: mockAuthProvider,
        mediaStore,
      };

      await fileFetcher.copyFile(source, destination);

      const copiedFileObservable = getFileStreamsCache().get('copied-file-id');
      if (!copiedFileObservable) {
        return expect(copiedFileObservable).toBeDefined();
      }

      const copiedFileState = await observableToPromise(copiedFileObservable);
      expect(copiedFileState).toEqual({
        id: 'copied-file-id',
        name: 'copied-file-name',
        status: 'failed-processing',
        artifacts: {},
        mediaType: 'archive',
        mimeType: 'application/zip',
        representations: {},
        size: 1,
        createdAt: -1,
      });
    });

    it('should not populate cache when copied file "processingStatus" is pending', async () => {
      const { items, fileFetcher, mockAuthProvider } = setup();
      const copiedFile: MediaFile = {
        id: 'copied-file-id',
        name: 'copied-file-name',
        processingStatus: 'pending',
        artifacts: {},
        mediaType: 'archive',
        mimeType: 'application/zip',
        representations: {},
        size: 1,
        createdAt: -1,
      };
      const mediaStore = createMockMediaStore(jest.fn());
      asMock(mediaStore.copyFileWithToken).mockResolvedValue({
        data: copiedFile,
      });
      const source = {
        id: items[0].id,
        collection: 'someCollectionName',
        authProvider: mockAuthProvider,
      };
      const destination = {
        collection: RECENTS_COLLECTION,
        authProvider: mockAuthProvider,
        mediaStore,
      };

      await fileFetcher.copyFile(source, destination);

      const copiedFileObservable = getFileStreamsCache().get('copied-file-id');
      if (!copiedFileObservable) {
        return expect(copiedFileObservable).toBeDefined();
      }

      try {
        await Promise.race([
          observableToPromise(copiedFileObservable),
          timeoutPromise(
            300,
            'There should be no emission from copiedFileObservable',
          ),
        ]);
      } catch (e) {
        expect(e).toEqual(
          'There should be no emission from copiedFileObservable',
        );
      }
      expect.assertions(1);
    });

    it('should update cache in case of an error', async () => {
      const { items, fileFetcher, mockAuthProvider } = setup();
      const error = new Error('error while copying source file');
      const mediaStore = createMockMediaStore(jest.fn());
      asMock(mediaStore.copyFileWithToken).mockRejectedValue(error);

      const source = {
        id: items[0].id,
        collection: 'someCollectionName',
        authProvider: mockAuthProvider,
      };
      const destination = {
        collection: RECENTS_COLLECTION,
        replaceFileId: 'copied-file-id',
        authProvider: mockAuthProvider,
        mediaStore,
      };

      try {
        await fileFetcher.copyFile(source, destination);
      } catch (err) {
        expect(err).toEqual(error);

        const fileObservable = getFileStreamsCache().get(items[0].id);
        if (!fileObservable) {
          return expect(fileObservable).toBeDefined();
        }

        try {
          await observableToPromise(fileObservable);
        } catch (err) {
          expect(err).toEqual(error);
        }
      }

      expect.assertions(2);
    });

    it('should override preview when provided', async () => {
      const { items, fileFetcher, mockAuthProvider } = setup();
      const copiedFile: MediaFile = {
        id: 'copied-file-id',
        name: 'copied-file-name',
        processingStatus: 'succeeded',
        artifacts: {},
        mediaType: 'image',
        mimeType: 'image/jpeg',
        representations: {},
        size: 1,
      };
      const mediaStore = createMockMediaStore(jest.fn());
      asMock(mediaStore.copyFileWithToken).mockResolvedValue({
        data: copiedFile,
      });

      const source = {
        id: items[0].id,
        collection: 'someCollectionName',
        authProvider: mockAuthProvider,
      };
      const destination = {
        collection: RECENTS_COLLECTION,
        authProvider: mockAuthProvider,
        mediaStore,
      };
      const copyOptions = {
        preview: {
          value: new Blob([], { type: 'image/jpeg' }),
          origin: 'local',
        } as FilePreview,
      };
      await fileFetcher.copyFile(source, destination, copyOptions);

      const copiedFileObservable = getFileStreamsCache().get('copied-file-id');
      if (!copiedFileObservable) {
        return expect(copiedFileObservable).toBeDefined();
      }

      const copiedFileState = await observableToPromise(copiedFileObservable);
      if (!isPreviewableFileState(copiedFileState)) {
        return expect(isPreviewableFileState(copiedFileState)).toBeTruthy();
      }

      expect(copiedFileState.preview).toEqual(copyOptions.preview);
    });

    it('should override mimeType when provided', async () => {
      const { items, fileFetcher, mockAuthProvider } = setup();
      const copiedFile: MediaFile = {
        id: 'copied-file-id',
        name: 'copied-file-name',
        processingStatus: 'succeeded',
        artifacts: {},
        mediaType: 'unknown',
        mimeType: 'binary/octet-stream',
        representations: {},
        size: 1,
      };
      const mediaStore = createMockMediaStore(jest.fn());
      asMock(mediaStore.copyFileWithToken).mockResolvedValue({
        data: copiedFile,
      });

      const source = {
        id: items[0].id,
        collection: 'someCollectionName',
        authProvider: mockAuthProvider,
      };
      const destination = {
        collection: RECENTS_COLLECTION,
        authProvider: mockAuthProvider,
        mediaStore,
      };
      const copyOptions = {
        preview: {
          value: new Blob([], { type: 'image/jpeg' }),
          origin: 'local',
        } as FilePreview,
        mimeType: 'image/jpeg',
      };
      await fileFetcher.copyFile(source, destination, copyOptions);

      const copiedFileObservable = getFileStreamsCache().get('copied-file-id');
      if (!copiedFileObservable) {
        return expect(copiedFileObservable).toBeDefined();
      }

      const copiedFileState = await observableToPromise(copiedFileObservable);
      if (!isPreviewableFileState(copiedFileState)) {
        return expect(isPreviewableFileState(copiedFileState)).toBeTruthy();
      }

      expect(copiedFileState.mimeType).toEqual(copyOptions.mimeType);
    });

    it('should not override mimeType when not provided', async () => {
      const { items, fileFetcher, mockAuthProvider } = setup();
      const copiedFile: MediaFile = {
        id: 'copied-file-id',
        name: 'copied-file-name',
        processingStatus: 'succeeded',
        artifacts: {},
        mediaType: 'unknown',
        mimeType: 'binary/octet-stream',
        representations: {},
        size: 1,
      };
      const mediaStore = createMockMediaStore(jest.fn());
      asMock(mediaStore.copyFileWithToken).mockResolvedValue({
        data: copiedFile,
      });

      const source = {
        id: items[0].id,
        collection: 'someCollectionName',
        authProvider: mockAuthProvider,
      };
      const destination = {
        collection: RECENTS_COLLECTION,
        authProvider: mockAuthProvider,
        mediaStore,
      };
      const copyOptions = {
        preview: {
          value: new Blob([], { type: 'image/jpeg' }),
          origin: 'local',
        } as FilePreview,
      };
      await fileFetcher.copyFile(source, destination, copyOptions);

      const copiedFileObservable = getFileStreamsCache().get('copied-file-id');
      if (!copiedFileObservable) {
        return expect(copiedFileObservable).toBeDefined();
      }

      const copiedFileState = await observableToPromise(copiedFileObservable);
      if (!isPreviewableFileState(copiedFileState)) {
        return expect(isPreviewableFileState(copiedFileState)).toBeTruthy();
      }

      expect(copiedFileState.mimeType).toEqual(copiedFile.mimeType);
    });

    it('should fetch remote processing states for files requiring remote preview', async () => {
      const { items, fileFetcher, mediaStore, mockAuthProvider } = setup();
      const copiedFile: MediaFile = {
        id: 'copied-file-id',
        name: 'copied-file-name',
        artifacts: {},
        mediaType: 'doc',
        mimeType: 'application/pdf',
        representations: {},
        size: 1,
      };
      const copyFileWithTokenMock = jest
        .fn()
        .mockResolvedValue({ data: copiedFile });
      const tenantMediaStore = createMockMediaStore(jest.fn());
      tenantMediaStore.copyFileWithToken = copyFileWithTokenMock;

      const source = {
        id: items[0].id,
        collection: 'someCollectionName',
        authProvider: mockAuthProvider,
      };
      const destination = {
        collection: RECENTS_COLLECTION,
        authProvider: mockAuthProvider,
        mediaStore: tenantMediaStore,
      };
      await fileFetcher.copyFile(source, destination);
      expect(copyFileWithTokenMock).toHaveBeenCalledTimes(1);

      await sleep(0);
      expect(mediaStore.getItems).toHaveBeenCalledTimes(1);
      expect(mediaStore.getItems).toHaveBeenCalledWith(
        ['copied-file-id'],
        destination.collection,
      );
    });

    it('should not fetch remote processing states for files not requiring remote preview', async () => {
      const { items, fileFetcher, mediaStore, mockAuthProvider } = setup();
      const copiedFile: MediaFile = {
        id: 'copied-file-id',
        name: 'copied-file-name',
        artifacts: {},
        mediaType: 'image',
        mimeType: 'image/jpeg',
        representations: {},
        size: 1,
      };
      const copyFileWithTokenMock = jest
        .fn()
        .mockResolvedValue({ data: copiedFile });
      const tenantMediaStore = createMockMediaStore(jest.fn());
      tenantMediaStore.copyFileWithToken = copyFileWithTokenMock;

      const source = {
        id: items[0].id,
        collection: 'someCollectionName',
        authProvider: mockAuthProvider,
      };
      const destination = {
        collection: RECENTS_COLLECTION,
        authProvider: mockAuthProvider,
        mediaStore: tenantMediaStore,
      };

      const options = {
        preview: {
          value: new Blob([], { type: 'image/jpeg' }),
          origin: 'local',
        } as FilePreview,
      };

      await fileFetcher.copyFile(source, destination, options);
      expect(copyFileWithTokenMock).toHaveBeenCalledTimes(1);

      await sleep(0);
      expect(mediaStore.getItems).toHaveBeenCalledTimes(0);
    });

    it('should not fetch remote processing states for files not supported by server', async () => {
      const { items, fileFetcher, mediaStore, mockAuthProvider } = setup();
      const copiedFile: MediaFile = {
        id: 'copied-file-id',
        name: 'copied-file-name',
        artifacts: {},
        mediaType: 'archive',
        mimeType: 'application/zip',
        representations: {},
        size: 1,
      };
      const copyFileWithTokenMock = jest
        .fn()
        .mockResolvedValue({ data: copiedFile });
      const tenantMediaStore = createMockMediaStore(jest.fn());
      tenantMediaStore.copyFileWithToken = copyFileWithTokenMock;

      const source = {
        id: items[0].id,
        collection: 'someCollectionName',
        authProvider: mockAuthProvider,
      };
      const destination = {
        collection: RECENTS_COLLECTION,
        authProvider: mockAuthProvider,
        mediaStore: tenantMediaStore,
      };
      await fileFetcher.copyFile(source, destination);
      expect(copyFileWithTokenMock).toHaveBeenCalledTimes(1);

      await sleep(0);
      expect(mediaStore.getItems).toHaveBeenCalledTimes(0);
    });
  });

  describe('uploadExternal()', () => {
    const url = 'https://atlassian/logo.png';

    it('should populate cache before upload finishes', async () => {
      const { fileFetcher } = setup();

      fileFetcher.uploadExternal(url);

      const fileObservable = getFileStreamsCache().get('upfront-id');
      if (!fileObservable) {
        return expect(fileObservable).toBeDefined();
      }

      const fileState = await observableToPromise(fileObservable);
      expect(fileState).toEqual(
        expect.objectContaining({
          status: 'processing',
          name: 'logo.png',
          size: 0,
          mediaType: 'unknown',
          mimeType: '',
          id: 'upfront-id',
          occurrenceKey: 'upfront-occurrence-key',
        }),
      );
    });

    it('should set preview on cache for that file', async () => {
      const { fileFetcher } = setup();

      fetchMock.mock(
        url,
        {
          headers: { 'Content-Type': 'image/jpeg' },
          body: new Blob([], { type: 'image/jpeg' }),
        },
        { sendAsJson: false },
      );

      await fileFetcher.uploadExternal(url);

      const fileObservable = getFileStreamsCache().get('upfront-id');
      if (!fileObservable) {
        return expect(fileObservable).toBeDefined();
      }

      const fileState = await observableToPromise(fileObservable);
      if (isErrorFileState(fileState)) {
        return expect(fileState.status).not.toBe('error');
      }

      if (!fileState.preview) {
        return expect(fileState.preview).toBeDefined();
      }

      expect((await fileState.preview).value).toBeInstanceOf(Blob);
    });

    it('should use collection name', async () => {
      const { fileFetcher } = setup();
      const uploadSpy = jest.spyOn(fileFetcher, 'upload');
      const collection = 'destination-collection';
      await fileFetcher.uploadExternal(url, collection);

      expect(
        (fileFetcher as any).generateUploadableFileUpfrontIds,
      ).toBeCalledWith(collection);
      expect(uploadSpy.mock.calls[0][0]).toEqual(
        expect.objectContaining({ collection }),
      );
    });

    it('should extract the name from the url', async () => {
      const { fileFetcher } = setup();

      fileFetcher.uploadExternal('domain.com/path/file_name.mov');

      const fileObservable = getFileStreamsCache().get('upfront-id');
      if (!fileObservable) {
        return expect(fileObservable).toBeDefined();
      }

      const fileState = await observableToPromise(fileObservable);
      expect(fileState).toEqual(
        expect.objectContaining({
          name: 'file_name.mov',
        }),
      );
    });

    it('should set the right mediaType', async () => {
      const { fileFetcher } = setup();

      fetchMock.mock(
        url,
        {
          headers: { 'Content-Type': 'image/jpeg' },
          body: new Blob([], { type: 'image/jpeg' }),
        },
        { sendAsJson: false },
      );

      await fileFetcher.uploadExternal(url);

      const fileObservable = getFileStreamsCache().get('upfront-id');
      if (!fileObservable) {
        return expect(fileObservable).toBeDefined();
      }

      const fileState = await observableToPromise(fileObservable);
      expect(fileState).toEqual(
        expect.objectContaining({
          mediaType: 'image',
        }),
      );
    });
  });

  describe('upload()', () => {
    it('should populate cache before upload finishes', async () => {
      const {
        fileFetcher,
        createUploadableFile,
        uploadFileUpfrontIds,
      } = setup();

      fileFetcher.upload(
        createUploadableFile('logo.png', 'image/png'),
        undefined,
        uploadFileUpfrontIds,
      );

      const fileObservable = getFileStreamsCache().get('upfront-id');
      if (!fileObservable) {
        return expect(fileObservable).toBeDefined();
      }

      const fileState = await observableToPromise(fileObservable);
      expect(fileState).toEqual(
        expect.objectContaining({
          status: 'uploading',
          name: 'logo.png',
          size: 0,
          mediaType: 'image',
          mimeType: 'image/png',
          id: 'upfront-id',
          occurrenceKey: 'upfront-occurrence-key',
        }),
      );
    });

    it('should be abortable', async () => {
      const {
        fileFetcher,
        createUploadableFile,
        uploadFileUpfrontIds,
      } = setup();

      const uploadController = new UploadController();

      asMockFunction(uploadFile).mockImplementation(
        (
          _1: UploadableFile,
          _2: MediaStore,
          _3: UploadableFileUpfrontIds,
          callbacks?: UploadFileCallbacks,
        ) => {
          if (callbacks) {
            callbacks.onProgress(0);
            setImmediate(() => {
              callbacks.onProgress(0.5);
              callbacks.onProgress(1);
              callbacks.onUploadFinish();
            });
          }

          return {
            cancel: jest.fn(),
          };
        },
      );

      fileFetcher.upload(
        createUploadableFile('logo.png', 'image/png'),
        uploadController,
        uploadFileUpfrontIds,
      );

      uploadController.abort();

      const fileObservable = getFileStreamsCache().get('upfront-id');
      if (!fileObservable) {
        return expect(fileObservable).toBeDefined();
      }

      const fileState = await observableToPromise(fileObservable);
      expect(fileState).toEqual(
        expect.objectContaining({
          status: 'uploading',
          progress: 0,
          name: 'logo.png',
          size: 0,
          mediaType: 'image',
          mimeType: 'image/png',
          id: 'upfront-id',
          occurrenceKey: 'upfront-occurrence-key',
        }),
      );
    });

    it('should set preview on cache for that file', async () => {
      const {
        fileFetcher,
        createUploadableFile,
        uploadFileUpfrontIds,
      } = setup();

      fileFetcher.upload(
        createUploadableFile('logo.png', 'image/png'),
        undefined,
        uploadFileUpfrontIds,
      );

      const fileObservable = getFileStreamsCache().get('upfront-id');
      if (!fileObservable) {
        return expect(fileObservable).toBeDefined();
      }

      const fileState = await observableToPromise(fileObservable);
      if (isErrorFileState(fileState)) {
        return expect(fileState.status).not.toBe('error');
      }

      const filePreview = fileState.preview;
      if (!filePreview) {
        return expect(filePreview).toBeDefined();
      }

      expect((await filePreview).value).toBeInstanceOf(Blob);
    });

    it('should set the right mediaType', async () => {
      const {
        fileFetcher,
        createUploadableFile,
        uploadFileUpfrontIds,
      } = setup();

      fileFetcher.upload(
        createUploadableFile('logo.png', 'image/png'),
        undefined,
        uploadFileUpfrontIds,
      );

      const fileObservable = getFileStreamsCache().get('upfront-id');
      if (!fileObservable) {
        return expect(fileObservable).toBeDefined();
      }

      const fileState = await observableToPromise(fileObservable);
      expect(fileState).toEqual(
        expect.objectContaining({
          mediaType: 'image',
        }),
      );
    });

    it('should emit @atlaskit/chunkinator errors through ReplaySubject', async () => {
      const {
        fileFetcher,
        createUploadableFile,
        uploadFileUpfrontIds,
      } = setup();

      const error = new Error('chunkinator any kind of error');

      asMockFunction(uploadFile).mockImplementation(
        (
          _1: UploadableFile,
          _2: MediaStore,
          _3: UploadableFileUpfrontIds,
          callbacks?: UploadFileCallbacks,
        ) => {
          if (callbacks) {
            callbacks.onUploadFinish(error);
          }

          return {
            cancel: jest.fn(),
          };
        },
      );

      fileFetcher.upload(
        createUploadableFile('logo.png', 'image/png'),
        undefined,
        uploadFileUpfrontIds,
      );

      const fileObservable = getFileStreamsCache().get('upfront-id');
      if (!fileObservable) {
        return expect(fileObservable).toBeDefined();
      }

      try {
        await observableToPromise(fileObservable);
      } catch (err) {
        expect(err).toEqual(error);
      }

      expect.assertions(1);
    });

    it('should fetch remote processing states for files requiring remote preview', (done) => {
      const {
        mediaStore,
        fileFetcher,
        createUploadableFile,
        uploadFileUpfrontIds,
      } = setup();

      fileFetcher.upload(
        createUploadableFile('image.heic', 'image/heic'), // requires remote preview
        undefined,
        uploadFileUpfrontIds,
      );

      setImmediate(() => {
        expect(mediaStore.getItems).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('should not fetch remote processing states for files not requiring remote preview', (done) => {
      const {
        mediaStore,
        fileFetcher,
        createUploadableFile,
        uploadFileUpfrontIds,
      } = setup();

      fileFetcher.upload(
        createUploadableFile('image.jpg', 'image/jpeg'), // doesn't require remote preview
        undefined,
        uploadFileUpfrontIds,
      );

      setImmediate(() => {
        expect(mediaStore.getItems).toHaveBeenCalledTimes(0);
        done();
      });
    });

    it('should not fetch remote processing states for files not supported by server', (done) => {
      const {
        mediaStore,
        fileFetcher,
        createUploadableFile,
        uploadFileUpfrontIds,
      } = setup();

      fileFetcher.upload(
        createUploadableFile('archive.zip', 'application/zip'), // not supported by server
        undefined,
        uploadFileUpfrontIds,
      );

      expect(isMimeTypeSupportedByServer('application/zip')).toEqual(false);

      setImmediate(() => {
        expect(mediaStore.getItems).toHaveBeenCalledTimes(0);
        done();
      });
    });
  });

  describe('FileFetcherError', () => {
    it('should be identifiable', () => {
      const unknownError = new Error('unknown error');
      expect(isFileFetcherError(unknownError)).toBeFalsy();
      const fileFetcherError = new FileFetcherError('invalidFileId', 'some-id');
      expect(isFileFetcherError(fileFetcherError)).toBeTruthy();
    });

    it('should return the right arguments', () => {
      const fileFetcherError = new FileFetcherError('invalidFileId', 'id', {
        collectionName: 'collectionName',
        occurrenceKey: 'occurrenceKey',
      });
      expect(fileFetcherError.attributes).toMatchObject({
        reason: 'invalidFileId',
        id: 'id',
        collectionName: 'collectionName',
        occurrenceKey: 'occurrenceKey',
      });
    });
  });
});
