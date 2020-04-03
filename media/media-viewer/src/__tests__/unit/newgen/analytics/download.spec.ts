import { downloadButtonEvent } from '../../../../newgen/analytics/download';
import {
  processedFile,
  processingFile,
  uploadingFile,
  processingError,
  fileWithError,
} from './index.spec';
import { version as packageVersion } from '../../../../version.json';
import { ProcessedFileState } from '@atlaskit/media-client';

const unsupportedFile: ProcessedFileState = {
  ...processedFile,
  mediaType: 'unknown',
};

const basePayload = {
  eventType: 'ui',
  action: 'clicked',
  actionSubject: 'button',
  actionSubjectId: 'downloadButton',
};

const contextPayload = {
  componentName: 'media-viewer',
  packageName: '@atlaskit/media-viewer',
  packageVersion,
};

const commonFileProperties = {
  fileId: 'some-id',
  fileMimetype: 'jpg',
  fileSize: 100,
};

describe('downloadButtonEvent payload', () => {
  describe('by file status', () => {
    it('for processed files', () => {
      expect(downloadButtonEvent(processedFile)).toEqual({
        ...basePayload,
        attributes: {
          ...contextPayload,
          ...commonFileProperties,
          fileMediatype: 'image',
          fileProcessingStatus: 'processed',
          fileSupported: true,
        },
      });
    });

    it('for processing files', () => {
      expect(downloadButtonEvent(processingFile)).toEqual({
        ...basePayload,
        attributes: {
          ...contextPayload,
          ...commonFileProperties,
          fileMediatype: 'image',
          fileProcessingStatus: 'processing',
          fileSupported: true,
        },
      });
    });

    it('for uploading files', () => {
      expect(downloadButtonEvent(uploadingFile)).toEqual({
        ...basePayload,
        attributes: {
          ...contextPayload,
          ...commonFileProperties,
          fileMediatype: 'image',
          fileProcessingStatus: 'uploading',
          fileSupported: true,
        },
      });
    });

    it('for files that failed to be processed', () => {
      expect(downloadButtonEvent(processingError)).toEqual({
        ...basePayload,
        attributes: {
          ...contextPayload,
          ...commonFileProperties,
          fileId: 'some-id',
          fileMediatype: 'image',
          fileProcessingStatus: 'failed-processing',
          fileSupported: true,
        },
      });
    });

    it('when error', () => {
      expect(downloadButtonEvent(fileWithError)).toEqual({
        ...basePayload,
        attributes: {
          ...contextPayload,
          fileId: 'some-id',
          fileProcessingStatus: 'error',
        },
      });
    });
  });

  it('should include fileSupported', () => {
    expect(downloadButtonEvent(unsupportedFile)).toEqual({
      ...basePayload,
      attributes: {
        ...contextPayload,
        ...commonFileProperties,
        fileMediatype: 'unknown',
        fileProcessingStatus: 'processed',
        fileSupported: false,
      },
    });
  });
});
