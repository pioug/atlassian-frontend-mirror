jest.mock('chunkinator');

import chunkinator, { Options } from 'chunkinator';
import { AuthProvider, MediaApiConfig } from '@atlaskit/media-core';
import { uploadFile, UploadableFileUpfrontIds, MediaStore } from '../..';

describe('Uploader', () => {
  const uploadableFileUpfrontIds: UploadableFileUpfrontIds = {
    id: 'some-file-id',
    occurrenceKey: 'some-occurrence-key',
    deferredUploadId: Promise.resolve('some-upload-id'),
  };
  const setup = () => {
    const ChunkinatorMock = jest.fn();
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
    ChunkinatorMock.mockImplementation((_file, config: Options, callbacks) => {
      return {
        response: (async () => {
          callbacks.onProgress(0.1);
          await config.processingFunction!([
            { hash: '1', blob },
            { hash: '2', blob },
            { hash: '3', blob },
          ]);
          callbacks.onProgress(0.2);
          await config.processingFunction!([
            { hash: '4', blob },
            { hash: '5', blob },
            { hash: '6', blob },
          ]);
        })(),
        cancel,
      };
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

  it('should return cancel function given by Chunkinator', () => {
    const { mediaStore, cancel, ChunkinatorMock } = setup();
    (chunkinator as any) = ChunkinatorMock;
    const { cancel: actualCancel } = uploadFile(
      { content: 'file-content' },
      mediaStore as MediaStore,
      uploadableFileUpfrontIds,
    );
    actualCancel();
    expect(cancel).toHaveBeenCalledTimes(1);
  });

  it('should pass down the file content to Chunkinator', async () => {
    const { mediaStore, ChunkinatorMock } = setup();

    (chunkinator as any) = ChunkinatorMock;

    uploadFile(
      { content: 'file-content' },
      mediaStore as MediaStore,
      uploadableFileUpfrontIds,
    );

    expect(ChunkinatorMock.mock.calls[0][0]).toEqual('file-content');
  });

  it('should use provided file name, collection names and occurrence key when creating the file', async () => {
    const { mediaStore, ChunkinatorMock, createFileFromUpload } = setup();

    (chunkinator as any) = ChunkinatorMock;
    const response = Promise.resolve();
    ChunkinatorMock.mockImplementation(() => {
      return { response, cancel: jest.fn() };
    });

    uploadFile(
      {
        content: '',
        name: 'file-name',
        collection: 'some-collection',
        mimeType: 'some-mime-type',
      },
      mediaStore as MediaStore,
      uploadableFileUpfrontIds,
    );

    await uploadableFileUpfrontIds.deferredUploadId;
    await response;

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
  });

  it('should append the chunks to the upload in processing function', async () => {
    const { mediaStore, ChunkinatorMock, appendChunksToUpload } = setup();
    const onProgress = jest.fn();

    (chunkinator as any) = ChunkinatorMock;

    await new Promise((resolve, reject) => {
      uploadFile(
        { content: '' },
        mediaStore as MediaStore,
        uploadableFileUpfrontIds,
        { onProgress, onUploadFinish: err => (err ? reject(err) : resolve()) },
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
    const { mediaStore, ChunkinatorMock } = setup();
    const onProgress = jest.fn();

    (chunkinator as any) = ChunkinatorMock;

    await new Promise((resolve, reject) => {
      uploadFile(
        { content: '' },
        mediaStore as MediaStore,
        uploadableFileUpfrontIds,
        { onProgress, onUploadFinish: err => (err ? reject(err) : resolve()) },
      );
    });

    expect(onProgress).toHaveBeenCalledTimes(2);
    expect(onProgress.mock.calls[0][0]).toEqual(0.1);
    expect(onProgress.mock.calls[1][0]).toEqual(0.2);
  });

  it('should reject if there was an error with the upload', async () => {
    const { mediaStore, ChunkinatorMock } = setup();

    (chunkinator as any) = ChunkinatorMock;

    ChunkinatorMock.mockImplementation(() => {
      return {
        response: Promise.reject('some upload error'),
        cancel: jest.fn(),
      };
    });

    const error = await new Promise((resolve, reject) => {
      uploadFile(
        { content: '' },
        mediaStore as MediaStore,
        uploadableFileUpfrontIds,
        {
          onProgress: jest.fn(),
          onUploadFinish: err => (err ? resolve(err) : reject()),
        },
      );
    });
    expect(error).toEqual('some upload error');
  });

  it('should create the file after all chunks have been appended', async () => {
    expect.assertions(3);
    const {
      mediaStore,
      ChunkinatorMock,
      appendChunksToUpload,
      createFileFromUpload,
    } = setup();

    (chunkinator as any) = ChunkinatorMock;
    mediaStore.createFileFromUpload = () => {
      expect(appendChunksToUpload).toHaveBeenCalledTimes(2);
      return createFileFromUpload();
    };
    mediaStore.appendChunksToUpload = () => {
      expect(createFileFromUpload).toHaveBeenCalledTimes(0);
      return appendChunksToUpload();
    };

    await new Promise((resolve, reject) => {
      uploadFile(
        { content: '' },
        mediaStore as MediaStore,
        uploadableFileUpfrontIds,
        {
          onProgress: jest.fn(),
          onUploadFinish: err => (err ? reject(err) : resolve()),
        },
      );
    });
  });
});
