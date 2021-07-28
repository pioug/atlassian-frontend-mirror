jest.mock('../../uploader');

import uuid from 'uuid/v4';
import { AuthProvider, Auth } from '@atlaskit/media-core';
import {
  asMockFunction,
  asMockFunctionResolvedValue,
} from '@atlaskit/media-test-helpers';
import { Subscription } from 'rxjs/Subscription';

import {
  MediaClient,
  MediaStore,
  MediaStoreResponse,
  ItemsPayload,
  MediaFileProcessingStatus,
  FileFetcherImpl,
  FileState,
  UploadingFileState,
  ProcessingFileState,
  isErrorFileState,
  UploadableFileUpfrontIds,
  UploadableFile,
  UploadController,
  getFileStreamsCache,
  MediaStoreGetFileImageParams,
} from '../..';
import { uploadFile } from '../../uploader';

const auth = {
  token: 'some-token-that-does-not-really-matter-in-this-tests',
  clientId: 'some-clientId',
  baseUrl: 'some-base-url',
};
const authProvider: AuthProvider = () => Promise.resolve(auth);

const createMediaClient = (initialAuth?: Auth) => {
  const mediaClient = new MediaClient({ authProvider, initialAuth });
  const { MediaStore: MockMediaStore } = jest.genMockFromModule(
    '@atlaskit/media-client',
  );
  const fakeStore = new MockMediaStore() as jest.Mocked<MediaStore>;
  (fakeStore as any).featureFlags = {
    poll_intervalMs: 1,
    poll_backoffFactor: 1,
  };
  (fakeStore.getFileImageURLSync as jest.Mock).mockReturnValue('some-url');
  (mediaClient as any).mediaStore = fakeStore;
  (mediaClient as any).file = new FileFetcherImpl(fakeStore);
  return mediaClient;
};

describe('MediaClient', () => {
  const setup = () => {
    const id = uuid();
    const occurrenceKey = uuid();

    return {
      id,
      occurrenceKey,
      uploadableFileUpfrontIds: {
        id,
        occurrenceKey,
        deferredUploadId: Promise.resolve(uuid()),
      },
      mediaClient: createMediaClient(),
      controller: new UploadController(),
      getOrInsertSpy: jest.spyOn(getFileStreamsCache(), 'getOrInsert'),
      mockUploadFile: asMockFunction(uploadFile).mockReset(),
    };
  };

  describe('.file.getFileState()', () => {
    it('should fetch the file if it doesnt exist locally', (done) => {
      const { id, mediaClient } = setup();

      asMockFunctionResolvedValue(mediaClient.mediaStore.getItems, {
        data: {
          items: [
            {
              id,
              type: 'file',
              collection: 'some-collection',
              details: {
                mediaType: 'image',
                mimeType: 'image/jpeg',
                name: 'file-one',
                size: 1,
                processingStatus: 'succeeded',
                artifacts: {},
                representations: {},
              },
            },
          ],
        },
      });

      mediaClient.file
        .getFileState(id, {
          collectionName: 'some-collection',
        })
        .subscribe({
          next: (state) => {
            expect(mediaClient.mediaStore.getItems).toHaveBeenCalledTimes(1);
            expect(mediaClient.mediaStore.getItems).lastCalledWith(
              [id],
              'some-collection',
            );
            expect(state).toEqual({
              id,
              mediaType: 'image',
              mimeType: 'image/jpeg',
              name: 'file-one',
              status: 'processed',
              size: 1,
              artifacts: {},
              representations: {},
            });
            done();
          },
        });
    });

    it('should poll for changes and return the latest file state', (done) => {
      const { id, mediaClient } = setup();
      const next = jest.fn();

      const getFilePromiseWithProcessingStatus = (
        processingStatus: MediaFileProcessingStatus,
      ): Promise<MediaStoreResponse<ItemsPayload>> =>
        Promise.resolve({
          data: {
            items: [
              {
                id,
                type: 'file',
                details: {
                  mediaType: 'image',
                  mimeType: 'image/jpeg',
                  name: 'file-one',
                  size: 1,
                  processingStatus,
                  artifacts: {},
                  representations: {},
                },
              },
            ],
          },
        });

      asMockFunction(mediaClient.mediaStore.getItems)
        .mockReturnValueOnce(getFilePromiseWithProcessingStatus('pending'))
        .mockReturnValueOnce(getFilePromiseWithProcessingStatus('succeeded'));

      mediaClient.file.getFileState(id).subscribe({
        next,
        complete() {
          expect(mediaClient.mediaStore.getItems).toHaveBeenCalledTimes(2);
          expect(next).toHaveBeenCalledTimes(2);
          expect(next.mock.calls[0][0].status).toEqual('processing');
          expect(next.mock.calls[1][0].status).toEqual('processed');
          done();
        },
      });
    });

    it('should pass options down', () => {
      const { id, mediaClient, getOrInsertSpy } = setup();

      mediaClient.file.getFileState(id, {
        collectionName: 'my-collection',
        occurrenceKey: 'some-occurrenceKey',
      });

      expect(getOrInsertSpy).toHaveBeenLastCalledWith(id, expect.any(Function));
    });

    it('should return local file state while file is still uploading', (done) => {
      const {
        controller,
        mediaClient,
        uploadableFileUpfrontIds,
        mockUploadFile,
      } = setup();

      const file: UploadableFile = {
        content: new Blob(),
      };

      mockUploadFile.mockReturnValue({ cancel: jest.fn() });

      const subscription = new Subscription();
      subscription.add(
        mediaClient.file
          .upload(file, controller, uploadableFileUpfrontIds)
          .subscribe({
            next(state) {
              const fileId = state.id;
              const occurrenceKey = state.occurrenceKey;
              mediaClient.file.getFileState(fileId).subscribe({
                next(state) {
                  const expectedState: UploadingFileState = {
                    id: fileId,
                    status: 'uploading',
                    progress: 0,
                    name: '',
                    mediaType: 'unknown',
                    mimeType: '',
                    size: 0,
                    occurrenceKey,
                  };
                  expect(state).toEqual(expectedState);
                  expect(mediaClient.mediaStore.getFile).not.toBeCalled();
                  subscription.unsubscribe();
                  done();
                },
              });
            },
          }),
      );
    });

    it('should return file state regardless of the state', (done) => {
      const {
        controller,
        id,
        mediaClient,
        occurrenceKey,
        uploadableFileUpfrontIds,
        mockUploadFile,
      } = setup();

      asMockFunctionResolvedValue(mediaClient.mediaStore.getFile, {
        data: {
          processingStatus: 'succeeded',
          id,
          name: 'file-one',
          size: 1,
          mediaType: 'image',
          mimeType: 'image/png',
          artifacts: {},
          representations: { image: {} },
        },
      });

      const next = jest.fn();
      const file: UploadableFile = {
        content: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=',
      };

      mockUploadFile.mockImplementation((_, __, ___, callbacks) => {
        callbacks && callbacks.onUploadFinish();
        return {
          cancel: jest.fn(),
        };
      });

      mediaClient.file
        .upload(file, controller, uploadableFileUpfrontIds)
        .subscribe({
          next,
          complete() {
            expect(next).toHaveBeenCalledTimes(1);
            const expectedState: ProcessingFileState = {
              id,
              status: 'processing',
              mediaType: 'image',
              mimeType: 'image/jpeg',
              name: '',
              size: 14,
              occurrenceKey,
              representations: {},
            };
            expect(next.mock.calls[0][0]).toEqual(
              expect.objectContaining(expectedState),
            );
            done();
          },
        });
    });
  });

  describe('.file.upload()', () => {
    it('should call media-client uploadFile with given arguments', (done) => {
      const {
        mediaClient,
        controller,
        uploadableFileUpfrontIds,
        mockUploadFile,
      } = setup();

      asMockFunctionResolvedValue(mediaClient.mediaStore.touchFiles, {
        data: { created: [] },
      });

      const file: UploadableFile = {} as any;

      mockUploadFile.mockImplementation((_, __, ___, callbacks) => {
        callbacks && callbacks.onProgress(0.1);
        return {
          cancel: jest.fn(),
        };
      });

      mediaClient.file
        .upload(file, controller, uploadableFileUpfrontIds)
        .subscribe({
          next() {
            expect(uploadFile).toHaveBeenCalled();
            expect(mockUploadFile).toBeCalledWith(
              file,
              mediaClient.mediaStore,
              uploadableFileUpfrontIds,
              expect.objectContaining({
                onProgress: expect.any(Function),
                onUploadFinish: expect.any(Function),
              }),
            );
            done();
          },
        });
    });

    it('should generate file id and get deferred uploadId', (done) => {
      const { mediaClient, mockUploadFile } = setup();

      asMockFunctionResolvedValue(mediaClient.mediaStore.touchFiles, {
        data: {
          created: [
            {
              fileId: 'some-file-id',
              uploadId: 'some-upload-id',
            },
          ],
        },
      });

      const file: UploadableFile = {
        collection: 'some-collection',
        name: 'some-name',
        mimeType: 'some-mime-type',
        content: {} as any,
      };
      mockUploadFile.mockImplementation((_, __, ___, callbacks) => {
        callbacks && callbacks.onProgress(0.1);
        return {
          cancel: jest.fn(),
        };
      });

      const subscription = new Subscription();
      subscription.add(
        mediaClient.file.upload(file).subscribe({
          async next() {
            expect(mediaClient.mediaStore.touchFiles).toHaveBeenCalledWith(
              {
                descriptors: [
                  {
                    fileId: expect.any(String),
                    occurrenceKey: expect.any(String),
                    collection: 'some-collection',
                  },
                ],
              },
              {
                collection: 'some-collection',
              },
            );
            const uploadableFileUpfrontIds = mockUploadFile.mock
              .calls[0][2] as UploadableFileUpfrontIds;
            const actualUploadId = await uploadableFileUpfrontIds.deferredUploadId;
            expect(actualUploadId).toEqual('some-upload-id');
            subscription.unsubscribe();
            done();
          },
        }),
      );
    });

    it('should call subscription error when upload is cancelled', () => {
      const {
        controller,
        mediaClient,
        uploadableFileUpfrontIds,
        mockUploadFile,
      } = setup();

      const file: UploadableFile = {
        content: new Blob(),
        collection: 'some-collection',
      };
      const cancelMock = jest.fn();
      mockUploadFile.mockImplementation((_, __, ___, callbacks) => {
        callbacks && callbacks.onProgress(0.1);
        return {
          cancel() {
            cancelMock();
            callbacks && callbacks.onUploadFinish('canceled');
          },
        };
      });

      return new Promise<void>((resolve) => {
        mediaClient.file
          .upload(file, controller, uploadableFileUpfrontIds)
          .subscribe({
            error: (error: any) => {
              expect(error).toEqual('canceled');
              expect(cancelMock).toHaveBeenCalledTimes(1);
              resolve();
            },
          });
        controller.abort();
        expect.assertions(2);
      });
    });

    it('should emit error when upload fail', (done) => {
      const { mediaClient, mockUploadFile } = setup();

      const file: UploadableFile = {
        content: new Blob([]),
      };

      const error = new Error('some-error-description');

      mockUploadFile.mockImplementation((_, __, ___, callbacks) => {
        callbacks && callbacks.onUploadFinish(error);
        return {
          cancel: jest.fn(),
        };
      });

      mediaClient.file
        .upload(file, undefined, {
          id: 'some-upfront-file-id',
          deferredUploadId: Promise.resolve('some-upload-id'),
          occurrenceKey: 'some-occurrence-key',
        })
        .subscribe({
          next: (fileState) => {
            // shouldn't emit any error fileState
            if (isErrorFileState(fileState)) {
              return expect(isErrorFileState(fileState)).toBeFalsy();
            }
          },
          error: (err) => {
            expect(err).toEqual(error);
            done();
          },
        });

      expect.assertions(1);
    });

    it('should not emit error fileState when upload cancelled', (done) => {
      const { mediaClient, mockUploadFile } = setup();

      const file: UploadableFile = {
        content: new Blob([]),
      };

      mockUploadFile.mockImplementation((_, __, ___, callbacks) => {
        callbacks && callbacks.onUploadFinish('canceled');
        return {
          cancel: jest.fn(),
        };
      });

      mediaClient.file
        .upload(file, undefined, {
          id: 'some-upfront-file-id',
          deferredUploadId: Promise.resolve('some-upload-id'),
          occurrenceKey: 'some-occurrence-key',
        })
        .subscribe({
          next: (fileState) => {
            // shouldn't emit any error fileState
            if (isErrorFileState(fileState)) {
              return expect(isErrorFileState(fileState)).toBeFalsy();
            }
          },
          error(errorMessage) {
            expect(errorMessage).toBe('canceled');
            done();
          },
        });
    });

    it('should emit file preview when file is a Blob', (done) => {
      const { mediaClient, uploadableFileUpfrontIds, mockUploadFile } = setup();

      const file: UploadableFile = {
        content: new File([], '', { type: 'image/png' }),
        name: 'file-name.png',
        mimeType: 'image/png',
      };

      mockUploadFile.mockImplementation((_, __, ___, callbacks) => {
        callbacks && callbacks.onProgress(0.1);
        return {
          cancel: jest.fn(),
        };
      });

      mediaClient.file
        .upload(file, undefined, uploadableFileUpfrontIds)
        .subscribe({
          next: (state) => {
            expect(state).toEqual({
              status: 'uploading',
              id: uploadableFileUpfrontIds.id,
              occurrenceKey: uploadableFileUpfrontIds.occurrenceKey,
              name: 'file-name.png',
              progress: 0.1,
              size: 0,
              mediaType: 'image',
              mimeType: 'image/png',
              preview: {
                value: file.content,
                origin: 'local',
              },
            });
            done();
          },
        });
    });
  });

  describe('#events', () => {
    const fileState: FileState = {
      status: 'uploading',
      id: '1',
      mediaType: 'image',
      mimeType: '',
      name: 'some-file',
      progress: 1,
      size: 1,
    };

    it('Should call event listener when an event is emitted', () => {
      const mediaClient = createMediaClient();
      const onFileUploaded = jest.fn();

      mediaClient.emit('file-added', fileState);
      mediaClient.on('file-added', onFileUploaded);
      mediaClient.emit('file-added', fileState);

      expect(onFileUploaded).toBeCalledTimes(1);
      expect(onFileUploaded).toBeCalledWith(fileState);
    });

    it('Should not call event listener if we unsubscribe', () => {
      const mediaClient = createMediaClient();
      const onFileUploaded = jest.fn();

      mediaClient.on('file-added', onFileUploaded);
      mediaClient.emit('file-added', fileState);
      mediaClient.off('file-added', onFileUploaded);
      mediaClient.emit('file-added', fileState);

      expect(onFileUploaded).toBeCalledTimes(1);
    });
  });

  describe('Sync Operations', () => {
    describe('getFileImageURLSync', () => {
      it('should return the file image preview url based on the file id', () => {
        const mediaClient = createMediaClient(auth);
        const params = { some: 'params' } as MediaStoreGetFileImageParams;
        const fileId = '1234';
        const url = mediaClient.getImageUrlSync(fileId, params);
        expect(mediaClient.mediaStore.getFileImageURLSync).toBeCalledWith(
          fileId,
          params,
        );
        expect(url).toEqual('some-url');
        expect.assertions(2);
      });
    });
  });
});
