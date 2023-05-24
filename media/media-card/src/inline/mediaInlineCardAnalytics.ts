import { FileState, ProcessedFileState } from '@atlaskit/media-client';
import {
  RenderInlineCardFailedEventPayload,
  RenderInlineCardSucceededEventPayload,
  extractErrorInfo,
} from '../utils/analytics';
import { MediaCardError } from '../errors';

export const getSucceededStatusPayload = (
  fileState?: FileState,
): RenderInlineCardSucceededEventPayload => {
  return {
    eventType: 'operational',
    action: 'succeeded',
    actionSubject: 'mediaInlineRender',
    attributes: {
      status: 'success',
      fileAttributes: {
        fileId: fileState?.id || '',
        fileSize: (fileState as ProcessedFileState)?.size,
        fileMediatype: (fileState as ProcessedFileState)?.mediaType,
        fileMimetype: (fileState as ProcessedFileState)?.mimeType,
        fileStatus: fileState?.status,
      },
    },
  };
};

export const getErrorStatusPayload = (
  error: MediaCardError,
  fileState?: FileState,
): RenderInlineCardFailedEventPayload => {
  return {
    eventType: 'operational',
    action: 'failed',
    actionSubject: 'mediaInlineRender',
    attributes: {
      status: 'fail',
      fileAttributes: {
        fileId: fileState?.id || '',
        fileStatus: fileState?.status,
      },
      ...extractErrorInfo(error),
    },
  };
};

export const getFailedProcessingStatusPayload = (
  fileState?: FileState,
): RenderInlineCardFailedEventPayload => {
  return {
    eventType: 'operational',
    action: 'failed',
    actionSubject: 'mediaInlineRender',
    attributes: {
      status: 'fail',
      fileAttributes: {
        fileId: fileState?.id || '',
        fileStatus: fileState?.status,
      },
      failReason: 'failed-processing',
    },
  };
};
