const uploadFileMock = jest.fn();

jest.mock('../../uploader', () => ({
  uploadFile: uploadFileMock,
}));

import uuid from 'uuid/v4';
import { AuthProvider } from '@atlaskit/media-core';
import {
  UploadableFileUpfrontIds,
  MediaStore,
  MediaStoreResponse,
  TouchedFiles,
  ProcessingFileState,
  UploadableFile,
  UploadController,
  UploadingFileState,
  MediaClient,
  getFileStreamsCache,
  FileState,
  isErrorFileState,
} from '../..';

import { ReplaySubject } from 'rxjs/ReplaySubject';

const getOrInsertSpy = jest.spyOn(getFileStreamsCache(), 'getOrInsert');
const authProvider: AuthProvider = () =>
  Promise.resolve({
    token: 'some-token-that-does-not-really-matter-in-this-tests',
    clientId: 'some-clientId',
    baseUrl: 'some-base-url',
  });

const createMediaClient = () => {
  return new MediaClient({ authProvider });
};

describe('MediaClient', () => {
  afterEach(() => {
    uploadFileMock.mockReset();
  });

  describe('.file.getFileState()', () => {
    let id: string;
    let occurrenceKey: string;
    let uploadableFileUpfrontIds: UploadableFileUpfrontIds;
    const controller = new UploadController();

    beforeEach(() => {
      id = uuid();
      occurrenceKey = uuid();
      uploadableFileUpfrontIds = {
        id,
        occurrenceKey,
        deferredUploadId: Promise.resolve(uuid()),
      };
    });

    it('should fetch the file if it doesnt exist locally', done => {
      const mediaClient = createMediaClient();
      const response = Promise.resolve({
        data: {
          items: [
            {
              id,
              collection: 'some-collection',
              details: {
                name: 'file-one',
                size: 1,
                processingStatus: 'succeeded',
              },
            },
          ],
        },
      });
      const getItems = jest.fn().mockReturnValue(response);
      const fakeStore = {
        getItems,
      };
      (mediaClient as any).mediaStore = fakeStore;
      (mediaClient.file as any).mediaStore = fakeStore;
      const observer = mediaClient.file.getFileState(id, {
        collectionName: 'some-collection',
      });

      observer.subscribe({
        next(state) {
          expect(getItems).toHaveBeenCalledTimes(1);
          expect(getItems).lastCalledWith([id], 'some-collection');
          expect(state).toEqual({
            id,
            status: 'processed',
            name: 'file-one',
            size: 1,
            artifacts: undefined,
          });
        },
        complete() {
          expect.assertions(3);
          done();
        },
      });
    });

    it('should poll for changes and return the latest file state', done => {
      const mediaClient = createMediaClient();
      const getFilePromiseWithProcessingStatus = (processingStatus: string) =>
        Promise.resolve({
          data: {
            items: [
              {
                id,
                details: {
                  name: 'file-one',
                  size: 1,
                  processingStatus,
                },
              },
            ],
          },
        });
      const getItems = jest
        .fn()
        .mockReturnValueOnce(getFilePromiseWithProcessingStatus('pending'))
        .mockReturnValueOnce(getFilePromiseWithProcessingStatus('succeeded'));
      const fakeStore = {
        getItems,
      };
      (mediaClient as any).mediaStore = fakeStore;
      (mediaClient.file as any).mediaStore = fakeStore;

      const observer = mediaClient.file.getFileState(id);
      const next = jest.fn();
      observer.subscribe({
        next,
        complete() {
          expect(getItems).toHaveBeenCalledTimes(2);
          expect(next).toHaveBeenCalledTimes(2);
          expect(next.mock.calls[0][0].status).toEqual('processing');
          expect(next.mock.calls[1][0].status).toEqual('processed');
          done();
        },
      });
    });

    it('should pass options down', () => {
      const mediaClient = createMediaClient();

      mediaClient.file.getFileState(id, {
        collectionName: 'my-collection',
        occurrenceKey: 'some-occurrenceKey',
      });

      expect(getOrInsertSpy).toHaveBeenLastCalledWith(id, expect.anything());
    });

    it('should return local file state while file is still uploading', done => {
      const mediaClient = createMediaClient();
      const getFile = jest.fn();
      const content = new Blob();
      const file = {
        content,
      };
      (mediaClient as any).mediaStore = {
        getFile,
      };
      uploadFileMock.mockReturnValue({ cancel: jest.fn() });

      const subscription = mediaClient.file
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
                expect(getFile).not.toBeCalled();
                subscription.unsubscribe();
                done();
              },
            });
          },
        });
    });

    it('should return file state regardless of the state', done => {
      const mediaClient = createMediaClient();
      const getFile = jest.fn().mockReturnValue({
        data: {
          processingStatus: 'succeeded',
          id,
          name: 'file-one',
          size: 1,
          mediaType: 'image',
          mimeType: 'image/png',
        },
      });
      const next = jest.fn();
      const file = {
        content: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=',
      };
      (mediaClient as any).mediaStore = { getFile };
      uploadFileMock.mockImplementation((_, __, ___, callbacks) => {
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
    let id;
    let occurrenceKey;
    let uploadableFileUpfrontIds: UploadableFileUpfrontIds;
    let promissedUploadId: string;
    let controller: UploadController;

    beforeEach(() => {
      id = uuid();
      occurrenceKey = uuid();
      promissedUploadId = uuid();
      uploadableFileUpfrontIds = {
        id,
        occurrenceKey,
        deferredUploadId: Promise.resolve(promissedUploadId),
      };
      controller = new UploadController();
    });

    it('should call media-client uploadFile with given arguments', () => {
      const mediaClient = createMediaClient();
      const file: UploadableFile = {} as any;
      uploadFileMock.mockImplementation((_, __, ___, callbacks) => {
        callbacks && callbacks.onProgress(0.1);
        return {
          cancel: jest.fn(),
        };
      });
      const touchFiles = jest.fn();
      const fakeStore: Partial<MediaStore> = {
        touchFiles,
      };
      (mediaClient as any).mediaStore = fakeStore;
      (mediaClient.file as any).mediaStore = fakeStore;
      touchFiles.mockReturnValue(new Promise(() => {}));

      const subscription = mediaClient.file.upload(file).subscribe({
        next() {
          expect(uploadFileMock).toHaveBeenCalled();
          expect(uploadFileMock.mock.calls[0][0]).toBe(file);
          expect(uploadFileMock.mock.calls[0][1]).toEqual(fakeStore);
          expect(uploadFileMock.mock.calls[0][2]).toEqual({
            id: expect.any(String),
            occurrenceKey: expect.any(String),
            deferredUploadId: expect.any(Promise),
          });
        },
      });
      subscription.unsubscribe();
      expect.assertions(4);
    });

    it('should generate file id and get deferred uploadId', done => {
      const mediaClient = createMediaClient();
      const file: UploadableFile = {
        collection: 'some-collection',
        name: 'some-name',
        mimeType: 'some-mime-type',
        content: {} as any,
      };
      uploadFileMock.mockImplementation((_, __, ___, callbacks) => {
        callbacks && callbacks.onProgress(0.1);
        return {
          cancel: jest.fn(),
        };
      });
      const touchFiles = jest.fn();
      const fakeStore: Partial<MediaStore> = {
        touchFiles,
      };
      (mediaClient as any).mediaStore = fakeStore;
      (mediaClient.file as any).mediaStore = fakeStore;
      const touchFilesResult: Promise<MediaStoreResponse<
        TouchedFiles
      >> = Promise.resolve({
        data: {
          created: [
            {
              fileId: 'some-file-id',
              uploadId: 'some-upload-id',
            },
          ],
        },
      });
      touchFiles.mockReturnValue(touchFilesResult);

      const subcription = mediaClient.file.upload(file).subscribe({
        async next() {
          expect(touchFiles).toHaveBeenCalledWith(
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
          const uploadableFileUpfrontIds = uploadFileMock.mock
            .calls[0][2] as UploadableFileUpfrontIds;
          const actualUploadId = await uploadableFileUpfrontIds.deferredUploadId;
          expect(actualUploadId).toEqual('some-upload-id');
          subcription.unsubscribe();
          done();
        },
      });
    });

    it('should call subscription error when upload is cancelled', () => {
      const mediaClient = createMediaClient();
      const getFile = jest.fn().mockReturnValue({
        data: {
          processingStatus: 'succeeded',
          id: 'file-id-1',
          name: 'file-one',
          size: 1,
        },
      });
      const subject = new ReplaySubject<FileState>(1).complete();
      const createDownloadFileStream = jest.fn().mockReturnValue(subject);
      const file = {
        content: new Blob(),
        collection: 'some-collection',
      };
      const cancelMock = jest.fn();
      (mediaClient as any).mediaStore = { getFile };
      (mediaClient as any).createDownloadFileStream = createDownloadFileStream;
      uploadFileMock.mockImplementation((_, __, ___, callbacks) => {
        callbacks && callbacks.onProgress(0.1);
        return {
          cancel() {
            cancelMock();
            callbacks && callbacks.onUploadFinish('some-error');
          },
        };
      });

      return new Promise(resolve => {
        mediaClient.file
          .upload(file, controller, uploadableFileUpfrontIds)
          .subscribe({
            error() {
              expect(cancelMock).toHaveBeenCalledTimes(1);
              resolve();
            },
          });
        controller.abort();
      });
    });

    it('should emit error fileState when upload fail', () => {
      const mediaClient = createMediaClient();
      const file: UploadableFile = {
        content: new Blob([]),
      };

      uploadFileMock.mockImplementation((_, __, ___, callbacks) => {
        callbacks &&
          callbacks.onUploadFinish(new Error('some-error-description'));
        return {
          cancel: jest.fn(),
        };
      });

      const subscription = mediaClient.file.upload(file, undefined, {
        id: 'some-upfront-file-id',
        deferredUploadId: Promise.resolve('some-upload-id'),
        occurrenceKey: 'some-occurrence-key',
      });

      return new Promise(resolve => {
        subscription.subscribe({
          next: fileState => {
            if (isErrorFileState(fileState)) {
              expect(fileState).toEqual({
                id: 'some-upfront-file-id',
                status: 'error',
                message: 'some-error-description',
              });
              resolve();
            }
          },
        });
      });
    });

    it('should not emit error fileState when upload cancelled', () => {
      const mediaClient = createMediaClient();
      const file: UploadableFile = {
        content: new Blob([]),
      };

      uploadFileMock.mockImplementation((_, __, ___, callbacks) => {
        callbacks && callbacks.onUploadFinish('canceled');
        return {
          cancel: jest.fn(),
        };
      });

      const subscription = mediaClient.file.upload(file, undefined, {
        id: 'some-upfront-file-id',
        deferredUploadId: Promise.resolve('some-upload-id'),
        occurrenceKey: 'some-occurrence-key',
      });

      return new Promise((resolve, reject) => {
        subscription.subscribe({
          next: fileState => {
            if (isErrorFileState(fileState)) {
              reject("Shouldn't emit error file state");
            }
          },
          error(errorMessage) {
            expect(errorMessage).toBe('canceled');
            resolve();
          },
        });
      });
    });

    it('should emit file preview when file is a Blob', done => {
      const mediaClient = createMediaClient();
      const getFile = jest.fn().mockReturnValue({
        data: {
          processingStatus: 'succeeded',
          id: 'file-id-1',
          name: 'file-one',
          size: 1,
        },
      });
      const file = {
        content: new File([], '', { type: 'image/png' }),
        name: 'file-name.png',
      };

      uploadFileMock.mockImplementation(() => {
        return {
          cancel: jest.fn(),
        };
      });

      (mediaClient as any).mediaStore = { getFile };

      const subscription = mediaClient.file
        .upload(file, controller, uploadableFileUpfrontIds)
        .subscribe({
          async next(state) {
            expect(state as UploadingFileState).toEqual(
              expect.objectContaining({
                name: 'file-name.png',
                mediaType: 'image',
              }),
            );
            expect(
              (await (state as UploadingFileState).preview!).value,
            ).toBeInstanceOf(Blob);
            subscription.unsubscribe();
            done();
          },
        });
    });

    it('should pass right mimeType when file is a Blob', done => {
      const mediaClient = createMediaClient();
      const getFile = jest.fn().mockReturnValue({
        data: {
          processingStatus: 'succeeded',
        },
      });
      const file = {
        content: new File([], '', { type: 'image/png' }),
      };
      uploadFileMock.mockImplementation(() => {
        return {
          cancel: jest.fn(),
        };
      });

      (mediaClient as any).mediaStore = { getFile };

      const subscription = mediaClient.file
        .upload(file, controller, uploadableFileUpfrontIds)
        .subscribe({
          next(state) {
            expect((state as UploadingFileState).mimeType).toEqual('image/png');
            subscription.unsubscribe();
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
});
