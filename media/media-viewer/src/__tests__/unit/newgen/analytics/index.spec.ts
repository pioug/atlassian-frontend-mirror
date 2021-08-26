import {
  ProcessedFileState,
  ProcessingFileState,
  UploadingFileState,
  ErrorFileState,
  ProcessingFailedState,
  RequestError,
} from '@atlaskit/media-client';
import { getFileAttributes } from '../../../../analytics';
import { MediaViewerError } from '../../../../errors';
import { createLoadFailedEvent } from '../../../../analytics/events/operational/loadFailed';
import { createZipEntryLoadFailedEvent } from '../../../../analytics/events/operational/zipEntryLoadFailed';

export const processedFile: ProcessedFileState = {
  status: 'processed',
  id: 'some-id',
  name: 'some name',
  size: 100,
  mediaType: 'image',
  mimeType: 'jpg',
  artifacts: {},
  representations: {},
};

export const processingFile: ProcessingFileState = {
  status: 'processing',
  id: 'some-id',
  name: 'some name',
  size: 100,
  mediaType: 'image',
  mimeType: 'jpg',
  representations: {},
};

export const uploadingFile: UploadingFileState = {
  status: 'uploading',
  id: 'some-id',
  name: 'some name',
  size: 100,
  progress: 50,
  mediaType: 'image',
  mimeType: 'jpg',
};

export const fileWithError: ErrorFileState = {
  status: 'error',
  id: 'some-id',
  message: 'some-error',
};

export const processingError: ProcessingFailedState = {
  status: 'failed-processing',
  id: 'some-id',
  name: 'some name',
  size: 100,
  mediaType: 'image',
  mimeType: 'jpg',
  artifacts: {},
  representations: {},
};

const commonFileProperties = {
  fileId: 'some-id',
  fileMediatype: 'image',
  fileMimetype: 'jpg',
  fileSize: 100,
};

describe('getFileAttributes()', () => {
  it('should extract right payload from processed files', () => {
    expect(getFileAttributes(processedFile)).toEqual(commonFileProperties);
  });

  it('should extract right payload from processing files', () => {
    expect(getFileAttributes(processingFile)).toEqual(commonFileProperties);
  });

  it('should extract right payload from uploading files', () => {
    expect(getFileAttributes(uploadingFile)).toEqual(commonFileProperties);
  });

  it('should extract right payload from files that failed to be processed', () => {
    expect(getFileAttributes(processingError)).toEqual(commonFileProperties);
  });

  it('should extract the minimum payload when error', () => {
    expect(getFileAttributes(fileWithError)).toEqual({
      fileId: 'some-id',
    });
  });

  it('should capture errorDetail when nativeError as secondary reason for load fail event', () => {
    expect(
      createLoadFailedEvent(
        'some-id',
        new MediaViewerError(
          'imageviewer-fetch-url',
          new Error('some-error-message'),
        ),
      ),
    ).toEqual({
      action: 'loadFailed',
      actionSubject: 'mediaFile',
      attributes: {
        error: 'nativeError',
        errorDetail: 'some-error-message',
        failReason: 'imageviewer-fetch-url',
        fileAttributes: {
          fileId: 'some-id',
          fileMediatype: undefined,
          fileMimetype: undefined,
          fileSize: undefined,
        },
        status: 'fail',
      },
      eventType: 'operational',
    });
  });

  it('should capture request metadata when requestError as secondary error for load fail event', () => {
    expect(
      createLoadFailedEvent(
        'some-id',
        new MediaViewerError(
          'imageviewer-fetch-url',
          new RequestError('serverInvalidBody', {
            method: 'GET',
            endpoint: '/some-endpoint',
          }),
        ),
      ),
    ).toEqual({
      action: 'loadFailed',
      actionSubject: 'mediaFile',
      attributes: {
        error: 'serverInvalidBody',
        failReason: 'imageviewer-fetch-url',
        request: {
          method: 'GET',
          endpoint: '/some-endpoint',
        },
        fileAttributes: {
          fileId: 'some-id',
          fileMediatype: undefined,
          fileMimetype: undefined,
          fileSize: undefined,
        },
        status: 'fail',
      },
      eventType: 'operational',
    });
  });

  it('should capture errorDetail when nativeError as secondary reason for zip fail event', () => {
    expect(
      createZipEntryLoadFailedEvent(
        {
          id: 'some-id',
          status: 'error',
        },
        new MediaViewerError(
          'imageviewer-fetch-url',
          new Error('some-error-message'),
        ),
      ),
    ).toEqual({
      action: 'zipEntryLoadFailed',
      actionSubject: 'mediaFile',
      attributes: {
        error: 'nativeError',
        errorDetail: 'some-error-message',
        failReason: 'imageviewer-fetch-url',
        compressedSize: -1,
        size: -1,
        encrypted: false,
        mimeType: 'undefined',
        fileAttributes: {
          fileId: 'some-id',
          fileMediatype: undefined,
          fileMimetype: undefined,
          fileSize: undefined,
          fileSource: undefined,
          fileStatus: undefined,
        },
        status: 'fail',
      },
      eventType: 'operational',
    });
  });
});
