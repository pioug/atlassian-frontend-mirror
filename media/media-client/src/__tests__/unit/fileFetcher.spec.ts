import { Auth, AuthProvider } from '@atlaskit/media-core';
import {
  ResponseFileItem,
  MediaFile,
  RECENTS_COLLECTION,
  globalMediaEventEmitter,
  MediaViewedEventPayload,
  getFileStreamsCache,
} from '../..';
import * as MediaClientModule from '../..';
import uuid from 'uuid';
import { FileFetcherImpl, getItemsFromKeys } from '../../client/file-fetcher';
import {
  expectFunctionToHaveBeenCalledWith,
  asMock,
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

describe('FileFetcher', () => {
  const fileId = 'some-file-id';
  const collectionName = 'some-collection-name';
  const fileName = 'some-name';
  const binaryUrl = 'some-binary-url';

  const setup = () => {
    getFileStreamsCache().removeAll();

    const items = [
      {
        id: uuid(),
        collection: 'collection-1',
        details: {
          name: 'file-1',
        },
      },
      {
        id: uuid(),
        collection: 'collection-1',
        details: {
          name: 'file-2',
        },
      },
      {
        id: uuid(),
        collection: 'collection-2',
        details: {
          name: 'file-3',
        },
      },
    ];
    const itemsResponse = Promise.resolve({
      data: {
        items,
      },
    });
    const mediaClient = fakeMediaClient();
    const mediaStore = {
      ...mediaClient.mediaStore,
      getFileBinaryURL: jest.fn(),
      getItems: jest.fn().mockReturnValue(itemsResponse),
    } as any;
    const fileFetcher = new FileFetcherImpl(mediaStore);

    (fileFetcher as any).generateUploadableFileUpfrontIds = jest
      .fn()
      .mockReturnValue({
        id: 'upfront-id',
        occurrenceKey: 'upfront-occurrence-key',
      });
    asMock(mediaStore.getFileBinaryURL).mockReturnValue(binaryUrl);

    return { fileFetcher, mediaStore, items, itemsResponse };
  };

  beforeEach(() => {
    jest.spyOn(globalMediaEventEmitter, 'emit');
  });

  afterEach(() => {
    getFileStreamsCache().removeAll();
    jest.restoreAllMocks();
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

      // TODO: JEST-23 this started failing in landkid - must be investigated
      // it('should create a link', () => {
      //   const lastAppendCall =
      //     appendChild.mock.calls[appendChild.mock.calls.length - 1];
      //   const link = lastAppendCall[0] as HTMLAnchorElement;
      //   expect(link.download).toBe(fileName);
      //   expect(link.href).toBe(binaryUrl);
      //   expect(link.target).toBe('media-download-iframe');
      // });

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
        const { mediaStore, fileFetcher } = setup();
        asMock(mediaStore.getFileBinaryURL).mockReturnValue(binaryUrl);
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
    //TODO: https://product-fabric.atlassian.net/browse/BUILDTOOLS-177
    it.skip('should group ids without collection in the same call to /items', done => {
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
  });

  describe('copyFile', () => {
    it('should call mediaStore.copyFileWithToken', async () => {
      // @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
      //See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
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
      // @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
      //See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
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
      const copiedFileState = await observableToPromise(copiedFileObservable!);

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
      const fileState = await observableToPromise(fileObservable!);

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

      await fileFetcher.uploadExternal(url);

      const fileObservable = getFileStreamsCache().get('upfront-id');
      const fileState = await observableToPromise(fileObservable!);

      if (fileState.status === 'error') {
        throw new Error();
      }

      expect((await fileState.preview!).value).toBeInstanceOf(Blob);
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
      const fileState = await observableToPromise(fileObservable!);

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
      const fileState = await observableToPromise(fileObservable!);

      expect(fileState).toEqual(
        expect.objectContaining({
          mediaType: 'image',
        }),
      );
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
