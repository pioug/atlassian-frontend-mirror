import { createDownloadButtonClickedEvent } from '../../../../analytics/events/ui/downloadButtonClicked';
import { createFailedPreviewDownloadButtonClickedEvent } from '../../../../analytics/events/ui/failedPreviewDownloadButtonClicked';
import { MediaViewerError } from '../../../../errors';
import {
  processedFile,
  processingFile,
  uploadingFile,
  processingError,
  fileWithError,
} from './index.spec';

const basePayload = {
  eventType: 'ui',
  action: 'clicked',
  actionSubject: 'button',
  actionSubjectId: 'downloadButton',
};

const commonFileProperties = {
  fileId: 'some-id',
  fileMimetype: 'jpg',
  fileSize: 100,
};

describe('downloadButtonEvent payload', () => {
  describe('by file status', () => {
    it('for processed files', () => {
      expect(createDownloadButtonClickedEvent(processedFile)).toEqual({
        ...basePayload,
        attributes: {
          fileAttributes: {
            ...commonFileProperties,
            fileMediatype: 'image',
          },
          fileProcessingStatus: 'processed',
        },
      });
    });

    it('for processing files', () => {
      expect(createDownloadButtonClickedEvent(processingFile)).toEqual({
        ...basePayload,
        attributes: {
          fileAttributes: {
            ...commonFileProperties,
            fileMediatype: 'image',
          },
          fileProcessingStatus: 'processing',
        },
      });
    });

    it('for uploading files', () => {
      expect(createDownloadButtonClickedEvent(uploadingFile)).toEqual({
        ...basePayload,
        attributes: {
          fileAttributes: {
            ...commonFileProperties,
            fileMediatype: 'image',
          },
          fileProcessingStatus: 'uploading',
        },
      });
    });

    it('for files that failed to be processed', () => {
      expect(createDownloadButtonClickedEvent(processingError)).toEqual({
        ...basePayload,
        attributes: {
          fileAttributes: {
            ...commonFileProperties,
            fileId: 'some-id',
            fileMediatype: 'image',
          },
          fileProcessingStatus: 'failed-processing',
        },
      });
    });

    it('when error', () => {
      expect(
        createFailedPreviewDownloadButtonClickedEvent(
          fileWithError,
          new MediaViewerError('unsupported'),
        ),
      ).toEqual({
        ...basePayload,
        actionSubjectId: 'failedPreviewDownloadButton',
        attributes: {
          fileAttributes: {
            fileId: 'some-id',
            fileMediatype: undefined,
            fileMimetype: undefined,
            fileSize: undefined,
          },
          fileProcessingStatus: 'error',
          failReason: 'unsupported',
        },
      });
    });
  });
});
