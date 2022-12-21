import { AuthProvider, MediaApiConfig } from '@atlaskit/media-core';
import {
  uploadFile,
  UploadableFileUpfrontIds,
  MediaStore,
  MediaChunksProbe,
} from '../..';

jest.mock('../../constants', () => ({
  __esModule: true,
  CHUNK_SIZE: 4,
  PROCESSING_BATCH_SIZE: 1,
}));

describe('Uploader', () => {
  afterEach(() => {
    jest.resetModules();
  });

  const uploadableFileUpfrontIds: UploadableFileUpfrontIds = {
    id: 'some-file-id',
    occurrenceKey: 'some-occurrence-key',
    deferredUploadId: Promise.resolve('some-upload-id'),
  };

  const data: MediaChunksProbe = {
    results: {
      ['some-etag']: {
        exists: true,
      },
    },
  };

  const authProvider: AuthProvider = () =>
    Promise.resolve({
      clientId: '',
      token: '',
      baseUrl: '',
    });

  const setup = () => {
    const config: MediaApiConfig = {
      authProvider,
    };

    const createFileFromUpload = jest
      .fn()
      .mockReturnValue(Promise.resolve({ data: { id: '123' } }));

    const uploadChunk = jest.fn().mockReturnValue(Promise.resolve());

    const probeChunks = jest.fn().mockReturnValue(Promise.resolve({ data }));

    const appendChunksToUpload = jest.fn().mockReturnValue(Promise.resolve(1));
    const mediaStore: Partial<MediaStore> = {
      createFileFromUpload,
      appendChunksToUpload,
      uploadChunk,
      probeChunks,
    };
    const cancel = jest.fn();

    return {
      mediaStore,
      config,
      cancel,
      createFileFromUpload,
      appendChunksToUpload,
    };
  };

  it('should upload file only once when processing batch is 1', (done) => {
    const { mediaStore, createFileFromUpload } = setup();

    uploadFile(
      {
        content: new Blob(['123']),
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
            undefined,
          );
          done();
        },
      },
    );

    expect.assertions(2);
  });

  it('should upload file only once when processing batches are 2', (done) => {
    const { mediaStore, createFileFromUpload } = setup();
    uploadFile(
      {
        content: new Blob(['12345']),
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
            undefined,
          );
          done();
        },
      },
    );

    expect.assertions(2);
  });
});
