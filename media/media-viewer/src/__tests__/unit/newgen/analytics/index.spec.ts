import { fileStateToFileGasPayload } from '../../../../newgen/analytics/index';
import {
  ProcessedFileState,
  ProcessingFileState,
  UploadingFileState,
  ErrorFileState,
  ProcessingFailedState,
} from '@atlaskit/media-client';

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
  message: 'some error',
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

describe('fileStateToFileGasPayload', () => {
  it('should extract right payload from processed files', () => {
    expect(fileStateToFileGasPayload(processedFile)).toEqual(
      commonFileProperties,
    );
  });

  it('should extract right payload from processing files', () => {
    expect(fileStateToFileGasPayload(processingFile)).toEqual(
      commonFileProperties,
    );
  });

  it('should extract right payload from uploading files', () => {
    expect(fileStateToFileGasPayload(uploadingFile)).toEqual(
      commonFileProperties,
    );
  });

  it('should extract right payload from files that failed to be processed', () => {
    expect(fileStateToFileGasPayload(processingError)).toEqual(
      commonFileProperties,
    );
  });

  it('should extract the minimum payload when error', () => {
    expect(fileStateToFileGasPayload(fileWithError)).toEqual({
      fileId: 'some-id',
    });
  });
});
