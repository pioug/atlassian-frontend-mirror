jest.mock('@atlaskit/chunkinator');

import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { mapTo } from 'rxjs/operators/mapTo';
import { chunkinator, ProbedBlob } from '@atlaskit/chunkinator';
import { AuthProvider, MediaApiConfig } from '@atlaskit/media-core';
import { uploadFile, UploadableFileUpfrontIds, MediaStore } from '../..';
import { asMockFunction, nextTick } from '@atlaskit/media-test-helpers';

describe('Uploader', () => {
  const probedBlob: ProbedBlob = {
    blob: new Blob(),
    hash: 'some-hash',
    exists: true,
  };
  const uploadableFileUpfrontIds: UploadableFileUpfrontIds = {
    id: 'some-file-id',
    occurrenceKey: 'some-occurrence-key',
    deferredUploadId: Promise.resolve('some-upload-id'),
  };
  const setup = () => {
    const ChunkinatorMock = asMockFunction(chunkinator);
    const config: MediaApiConfig = {
      authProvider,
    };
    const createFileFromUpload = jest
      .fn()
      .mockReturnValue(Promise.resolve({ data: { id: '123' } }));
    const appendChunksToUpload = jest.fn().mockReturnValue(Promise.resolve(1));
    const mediaStore: Partial<MediaStore> = {
      createFileFromUpload,
      appendChunksToUpload,
    };
    const cancel = jest.fn();
    const blob: Blob = null as any;
    ChunkinatorMock.mockImplementation((file, options, callbacks) => {
      return from(
        (async () => {
          callbacks.onProgress && callbacks.onProgress(0.1);
          await options.processingFunction!([
            { hash: '1', blob },
            { hash: '2', blob },
            { hash: '3', blob },
          ]);
          callbacks.onProgress && callbacks.onProgress(0.2);
          await options.processingFunction!([
            { hash: '4', blob },
            { hash: '5', blob },
            { hash: '6', blob },
          ]);
        })(),
      ).pipe(mapTo([probedBlob]));
    });

    return {
      mediaStore,
      ChunkinatorMock,
      config,
      cancel,
      createFileFromUpload,
      appendChunksToUpload,
    };
  };
  const authProvider: AuthProvider = () =>
    Promise.resolve({
      clientId: '',
      token: '',
      baseUrl: '',
    });

  it('should pass down the file content to Chunkinator', async () => {
    const { mediaStore, ChunkinatorMock } = setup();

    uploadFile(
      { content: 'file-content' },
      mediaStore as MediaStore,
      uploadableFileUpfrontIds,
    );

    expect(ChunkinatorMock.mock.calls[0][0]).toEqual('file-content');
  });

  it('should use provided file name, collection names and occurrence key when creating the file', (done) => {
    const { mediaStore, ChunkinatorMock, createFileFromUpload } = setup();

    ChunkinatorMock.mockImplementation(() =>
      from(Promise.resolve([probedBlob])),
    );

    uploadFile(
      {
        content: '',
        name: 'file-name',
        collection: 'some-collection',
        mimeType: 'some-mime-type',
      },
      mediaStore as MediaStore,
      uploadableFileUpfrontIds,
      {
        onProgress: jest.fn(),
        onUploadFinish: () => {
          expect(createFileFromUpload).toHaveBeenCalledTimes(1);
          expect(createFileFromUpload).toBeCalledWith(
            {
              uploadId: 'some-upload-id',
              name: 'file-name',
              mimeType: 'some-mime-type',
            },
            {
              occurrenceKey: 'some-occurrence-key',
              collection: 'some-collection',
              replaceFileId: 'some-file-id',
            },
          );
          done();
        },
      },
    );

    expect.assertions(2);
  });

  it('should append the chunks to the upload in processing function', async () => {
    const { mediaStore, appendChunksToUpload } = setup();
    const onProgress = jest.fn();

    await new Promise<void>((resolve, reject) => {
      uploadFile(
        { content: '' },
        mediaStore as MediaStore,
        uploadableFileUpfrontIds,
        {
          onProgress,
          onUploadFinish: (err) => (err ? reject(err) : resolve()),
        },
      );
    });

    expect(appendChunksToUpload).toHaveBeenCalledTimes(2);
    expect(appendChunksToUpload.mock.calls[0][0]).toEqual('some-upload-id');
    expect(appendChunksToUpload.mock.calls[0][1].chunks).toEqual([
      '1',
      '2',
      '3',
    ]);
    expect(appendChunksToUpload.mock.calls[0][1].offset).toEqual(0);
    expect(appendChunksToUpload.mock.calls[1][0]).toEqual('some-upload-id');
    expect(appendChunksToUpload.mock.calls[1][1].chunks).toEqual([
      '4',
      '5',
      '6',
    ]);
    expect(appendChunksToUpload.mock.calls[1][1].offset).toEqual(3);
  });

  it('should call onProgress with the upload percentage', async () => {
    const { mediaStore } = setup();
    const onProgress = jest.fn();

    await new Promise<void>((resolve, reject) => {
      uploadFile(
        { content: '' },
        mediaStore as MediaStore,
        uploadableFileUpfrontIds,
        {
          onProgress,
          onUploadFinish: (err) => (err ? reject(err) : resolve()),
        },
      );
    });

    expect(onProgress).toHaveBeenCalledTimes(2);
    expect(onProgress.mock.calls[0][0]).toEqual(0.1);
    expect(onProgress.mock.calls[1][0]).toEqual(0.2);
  });

  it('should reject if there was an error with the upload', async () => {
    const { mediaStore, ChunkinatorMock } = setup();

    ChunkinatorMock.mockImplementation(() =>
      from(Promise.reject('some upload error')),
    );

    const error = await new Promise((resolve, reject) => {
      uploadFile(
        { content: '' },
        mediaStore as MediaStore,
        uploadableFileUpfrontIds,
        {
          onProgress: jest.fn(),
          onUploadFinish: (err) => (err ? resolve(err) : reject()),
        },
      );
    });
    expect(error).toEqual('some upload error');
  });

  it('should reject if deferredUploadId rejects', async () => {
    const { mediaStore } = setup();

    const failedUploadIdError = new Error('some-failed-upload-id');

    const uploadableFileUpfrontIds: UploadableFileUpfrontIds = {
      id: 'some-file-id',
      occurrenceKey: 'some-occurrence-key',
      deferredUploadId: Promise.reject(failedUploadIdError),
    };

    const err = await new Promise((resolve, reject) => {
      uploadFile(
        { content: '' },
        mediaStore as MediaStore,
        uploadableFileUpfrontIds,
        {
          onProgress: jest.fn(),
          onUploadFinish: (err) => (err ? resolve(err) : reject()),
        },
      );
    });
    expect(err).toEqual(failedUploadIdError);
  });

  it('should create the file after all chunks have been appended', async () => {
    const { mediaStore, appendChunksToUpload, createFileFromUpload } = setup();

    mediaStore.createFileFromUpload = () => {
      expect(appendChunksToUpload).toHaveBeenCalledTimes(2);
      return createFileFromUpload();
    };
    mediaStore.appendChunksToUpload = () => {
      expect(createFileFromUpload).toHaveBeenCalledTimes(0);
      return appendChunksToUpload();
    };

    expect.assertions(3);

    await new Promise<void>((resolve, reject) => {
      uploadFile(
        { content: '' },
        mediaStore as MediaStore,
        uploadableFileUpfrontIds,
        {
          onProgress: jest.fn(),
          onUploadFinish: (err) => (err ? reject(err) : resolve()),
        },
      );
    });
  });

  it('should not subscribe to Chunkinator Observable if cancel() initially called', (done) => {
    const {
      mediaStore,
      ChunkinatorMock,
      appendChunksToUpload,
      createFileFromUpload,
    } = setup();

    const chunkinatorCalled = jest.fn();

    ChunkinatorMock.mockImplementation(
      () =>
        new Observable(() => {
          chunkinatorCalled();
        }),
    );

    const { cancel } = uploadFile(
      {
        content: '',
        name: 'file-name',
        collection: 'some-collection',
        mimeType: 'some-mime-type',
      },
      mediaStore as MediaStore,
      uploadableFileUpfrontIds,
      {
        onProgress: jest.fn(),
        onUploadFinish: (error) => {
          expect(error).toEqual('canceled');
          expect(chunkinatorCalled).toHaveBeenCalledTimes(0);
          expect(appendChunksToUpload).toHaveBeenCalledTimes(0);
          expect(createFileFromUpload).toHaveBeenCalledTimes(0);
          done();
        },
      },
    );

    cancel();
    expect.assertions(4);
  });

  it('should interrupt upload if cancel() is called', async () => {
    const { mediaStore, appendChunksToUpload, createFileFromUpload } = setup();

    const { cancel } = uploadFile(
      {
        content: '',
        name: 'file-name',
        collection: 'some-collection',
        mimeType: 'some-mime-type',
      },
      mediaStore as MediaStore,
      uploadableFileUpfrontIds,
      {
        onProgress: jest.fn(),
        onUploadFinish: (error) => {
          expect(error).toEqual('canceled');
          expect(appendChunksToUpload).toHaveBeenCalledTimes(1);
          expect(createFileFromUpload).toHaveBeenCalledTimes(0);
        },
      },
    );

    await nextTick();
    cancel();

    expect.assertions(3);
  });
});
