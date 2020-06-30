import { Auth, AuthProvider } from '@atlaskit/media-core';
import fetchMock from 'fetch-mock/cjs/client';
import {
  ResponseFileItem,
  ItemsPayload,
  MediaFile,
  MediaStore,
  MediaStoreResponse,
  RECENTS_COLLECTION,
  globalMediaEventEmitter,
  MediaViewedEventPayload,
  getFileStreamsCache,
  uploadFile,
  UploadableFile,
  UploadableFileUpfrontIds,
  UploadController,
  isErrorFileState,
} from '../..';
import * as MediaClientModule from '../..';
import uuid from 'uuid';
import { UploadFileCallbacks } from '../../uploader';
import { FileFetcherImpl, getItemsFromKeys } from '../../client/file-fetcher';
import {
  expectFunctionToHaveBeenCalledWith,
  asMock,
  asMockFunction,
  asMockFunctionReturnValue,
  fakeMediaClient,
} from '@atlaskit/media-test-helpers';
import { observableToPromise } from '../../utils/observableToPromise';

jest.mock('../../utils/getDimensionsFromBlob', () => {
  return {
    getDimensionsFromBlob: () => {
      return { width: 1, height: 1 };
    },
  };
});

jest.mock('../../utils/getMediaTypeFromMimeType', () => {
  return {
    getMediaTypeFromMimeType: () => 'image',
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
    const itemsResponse: Promise<MediaStoreResponse<
      ItemsPayload
    >> = Promise.resolve({
      data: {
        items,
      },
    });

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
      getFileBinaryURL: asMockFunctionReturnValue(
        mediaClient.mediaStore.getFileBinaryURL,
        Promise.resolve(binaryUrl),
      ),
      getItems: asMockFunctionReturnValue(
        mediaClient.mediaStore.getItems,
        itemsResponse,
      ),
    } as jest.Mocked<MediaStore>;

    const fileFetcher = new FileFetcherImpl(mediaStore);

    (fileFetcher as any).generateUploadableFileUpfrontIds = jest
      .fn()
      .mockReturnValue({
        id: 'upfront-id',
        occurrenceKey: 'upfront-occurrence-key',
      });

    return {
      fileFetcher,
      mediaStore,
      items,
      itemsResponse,
      createUploadableFile,
      uploadFileUpfrontIds,
    };
  };

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
    it('should return an errored observable if we pass an invalid file id', done => {
      const { fileFetcher } = setup();

      fileFetcher.getFileState('invalid-id').subscribe({
        error(error) {
          expect(error).toEqual('invalid id was passed to getFileState');
          done();
        },
      });
    });

    it('should split calls to /items by collection name', done => {
      const { fileFetcher, mediaStore, items } = setup();

      fileFetcher
        .getFileState(items[0].id, { collectionName: items[0].collection })
        .subscribe();
      fileFetcher
        .getFileState(items[1].id, { collectionName: items[1].collection })
        .subscribe();
      fileFetcher
        .getFileState(items[2].id, { collectionName: items[2].collection })
        .subscribe();

      setImmediate(() => {
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

    it('should group ids without collection in the same call to /items', done => {
      const { fileFetcher, mediaStore, items } = setup();

      fileFetcher.getFileState(items[0].id).subscribe();
      fileFetcher.getFileState(items[1].id).subscribe();
      fileFetcher.getFileState(items[2].id).subscribe();

      setImmediate(() => {
        expect(mediaStore.getItems).toHaveBeenCalledTimes(1);
        expect(mediaStore.getItems.mock.calls[0]).toEqual([
          [items[0].id, items[1].id, items[2].id],
          undefined,
        ]);
        done();
      });
    });

    it('should handle failures when fetching items', async done => {
      const { fileFetcher, mediaStore, items } = setup();
      const next = jest.fn();
      const error = jest.fn();

      mediaStore.getItems.mockImplementation(
        (_: string[], collectionName?: string) => {
          // We want to make one of the /items call to fail
          if (collectionName === 'collection-1') {
            return Promise.reject();
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
        expect(error).toBeCalledWith({
          id: items[0].id,
          collection: items[0].collection,
          error: expect.any(Error),
        });
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

    it('should return processing file state for empty files', async done => {
      const { fileFetcher, mediaStore, items } = setup();
      const next = jest.fn();
      const error = jest.fn();

      asMockFunctionReturnValue(
        mediaStore.getItems,
        Promise.resolve({
          data: {
            items: [
              {
                id: items[0].id,
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
        } as MediaStoreResponse<ItemsPayload>),
      );

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
      const MediaStoreSpy = jest.spyOn(MediaClientModule, 'MediaStore');
      const { items, fileFetcher } = setup();
      const copyFileWithTokenMock = jest.fn().mockResolvedValue({ data: {} });
      MediaStoreSpy.mockImplementation(
        () =>
          ({
            copyFileWithToken: copyFileWithTokenMock,
          } as any),
      );

      const owner: Auth = {
        asapIssuer: 'asapIssuer',
        token: 'sometoken',
        baseUrl: 'somebaseurl',
      };
      const authProvider: AuthProvider = () => Promise.resolve(owner);
      const userAuthProvider = jest.fn();

      const source = {
        id: items[0].id,
        collection: 'someCollectionName',
        authProvider,
      };
      const destination = {
        collection: RECENTS_COLLECTION,
        authProvider: userAuthProvider,
      };
      await fileFetcher.copyFile(source, destination);
      expectFunctionToHaveBeenCalledWith(copyFileWithTokenMock, [
        {
          sourceFile: {
            id: items[0].id,
            collection: 'someCollectionName',
            owner,
          },
        },
        {
          collection: RECENTS_COLLECTION,
        },
      ]);
      expect(MediaStoreSpy).toHaveBeenCalledWith({
        authProvider: destination.authProvider,
      });
    });

    it('should populate cache with the copied file', async () => {
      const MediaStoreSpy = jest.spyOn(MediaClientModule, 'MediaStore');
      const copiedFile: MediaFile = {
        id: 'copied-file-id',
        name: 'copied-file-name',
        artifacts: {},
        mediaType: 'audio',
        mimeType: '',
        representations: {},
        size: 1,
      };
      const { items, fileFetcher } = setup();
      const copyFileWithTokenMock = jest
        .fn()
        .mockResolvedValue({ data: copiedFile });
      MediaStoreSpy.mockImplementation(
        () =>
          ({
            copyFileWithToken: copyFileWithTokenMock,
          } as any),
      );

      const owner: Auth = {
        asapIssuer: 'asapIssuer',
        token: 'sometoken',
        baseUrl: 'somebaseurl',
      };
      const authProvider: AuthProvider = () => Promise.resolve(owner);
      const userAuthProvider = jest.fn();

      const source = {
        id: items[0].id,
        collection: 'someCollectionName',
        authProvider,
      };
      const destination = {
        collection: RECENTS_COLLECTION,
        authProvider: userAuthProvider,
      };
      await fileFetcher.copyFile(source, destination);
      const copiedFileObservable = getFileStreamsCache().get('copied-file-id');
      if (!copiedFileObservable) {
        return expect(copiedFileObservable).toBeDefined();
      }

      const copiedFileState = await observableToPromise(copiedFileObservable);
      expect(copiedFileState).toEqual({
        ...copiedFile,
        status: 'processing',
      });
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
      const collection = 'destination-collection';
      await fileFetcher.uploadExternal(url, collection);

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
          status: 'processing',
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

    it('should transform chunkinator errors into ErrorFileState', async () => {
      const {
        fileFetcher,
        createUploadableFile,
        uploadFileUpfrontIds,
      } = setup();

      asMockFunction(uploadFile).mockImplementation(
        (
          _1: UploadableFile,
          _2: MediaStore,
          _3: UploadableFileUpfrontIds,
          callbacks?: UploadFileCallbacks,
        ) => {
          if (callbacks) {
            callbacks.onUploadFinish(
              new Error('chunkinator any kind of error'),
            );
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

      const fileState = await observableToPromise(fileObservable);
      expect(fileState).toEqual(
        expect.objectContaining({
          id: 'upfront-id',
          status: 'error',
          message: 'chunkinator any kind of error',
        }),
      );
    });

    it('should fetch remote processing states for files requiring remote preview', done => {
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

    it('should not fetch remote processing states for files not requiring remote preview', done => {
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
  });
});

describe('getItemsFromKeys()', () => {
  const details = {} as any;

  it('should return the same an array with the same length', () => {
    const keys = [
      {
        id: '1',
      },
      {
        id: '2',
      },
      {
        id: '2',
        collection: 'user-collection',
      },
    ];
    const items: ResponseFileItem[] = [
      {
        id: '1',
        type: 'file',
        details,
      },
    ];

    expect(getItemsFromKeys(keys, items)).toHaveLength(keys.length);
  });

  it('should respect order', () => {
    const keys = [
      {
        id: '1',
      },
      {
        id: '2',
      },
      {
        id: '2',
        collection: 'user-collection',
      },
    ];
    const items: ResponseFileItem[] = [
      {
        id: '2',
        type: 'file',
        details: {
          ...details,
          name: 'file-2',
        },
      },
      {
        id: '1',
        type: 'file',
        details: {
          ...details,
          name: 'file-1',
        },
      },
    ];

    const result = getItemsFromKeys(keys, items);

    expect(result[0]).toEqual({
      name: 'file-1',
    });
    expect(result[1]).toEqual({
      name: 'file-2',
    });
    expect(result[2]).toBeUndefined();
  });

  it('should use collection name to find item', () => {
    const keys = [
      {
        id: '1',
        collection: 'first-collection',
      },
      {
        id: '1',
        collection: 'other-collection',
      },
      {
        id: '2',
        collection: 'user-collection',
      },
    ];
    const items: ResponseFileItem[] = [
      {
        id: '2',
        type: 'file',
        collection: 'user-collection',
        details: {
          ...details,
          name: 'file-2',
        },
      },
      {
        id: '1',
        type: 'file',
        collection: 'first-collection',
        details: {
          ...details,
          name: 'file-1',
        },
      },
    ];

    const result = getItemsFromKeys(keys, items);

    expect(result).toEqual([
      {
        name: 'file-1',
      },
      undefined,
      {
        name: 'file-2',
      },
    ]);
  });

  it('should return undefined for not found files', () => {
    const keys = [
      {
        id: '1',
        collection: 'a',
      },
      {
        id: '2',
        collection: 'b',
      },
    ];
    const items: ResponseFileItem[] = [
      {
        id: '2',
        type: 'file',
        details: {
          ...details,
          name: 'file-2',
        },
      },
    ];

    const result = getItemsFromKeys(keys, items);

    expect(result).toEqual([undefined, undefined]);
  });
});
