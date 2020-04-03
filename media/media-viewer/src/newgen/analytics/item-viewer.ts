import { GasPayload } from '@atlaskit/analytics-gas-types';
import { ProcessedFileState, FileState } from '@atlaskit/media-client';
import { packageAttributes, fileStateToFileGasPayload } from './index';

export type ViewerLoadPayload = {
  status: 'success' | 'error';
  errorMessage?: string;
};

export type AnalyticViewerProps = {
  onLoad: (payload: ViewerLoadPayload) => void;
};

export const mediaFileCommencedEvent = (id: string): GasPayload => {
  return {
    eventType: 'operational',
    action: 'commenced',
    actionSubject: 'mediaFile',
    actionSubjectId: id,
    attributes: {
      fileId: id,
      ...packageAttributes,
    },
  };
};

export const mediaFileLoadSucceededEvent = (
  file: ProcessedFileState,
): GasPayload => {
  return {
    eventType: 'operational',
    actionSubject: 'mediaFile',
    action: 'loadSucceeded',
    actionSubjectId: file.id,
    attributes: {
      status: 'success',
      ...fileStateToFileGasPayload(file),
      ...packageAttributes,
    },
  };
};

export const mediaFileLoadFailedEvent = (
  id: string,
  failReason: string,
  file?: ProcessedFileState,
): GasPayload => {
  const fileAttributes = file
    ? fileStateToFileGasPayload(file)
    : {
        fileId: id,
      };
  return {
    eventType: 'operational',
    actionSubject: 'mediaFile',
    action: 'loadFailed',
    actionSubjectId: id,
    attributes: {
      status: 'fail',
      ...fileAttributes,
      failReason,
      ...packageAttributes,
    },
  };
};

export const mediaPreviewFailedEvent = (
  failReason: string,
  fileState?: FileState,
): GasPayload => {
  const fileId = fileState ? fileState.id : undefined;
  const fileAttributes = fileState && fileStateToFileGasPayload(fileState);

  return {
    eventType: 'operational',
    actionSubject: 'mediaFile',
    action: 'previewFailed',
    actionSubjectId: fileId,
    attributes: {
      status: 'fail',
      ...fileAttributes,
      failReason,
      ...packageAttributes,
    },
  };
};
