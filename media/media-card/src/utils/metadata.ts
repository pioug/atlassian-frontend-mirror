import {
  FileState,
  FileDetails,
  isErrorFileState,
} from '@atlaskit/media-client';

const getProcessingStatusFromFileState = (status: FileState['status']) => {
  switch (status) {
    case 'processed':
      return 'succeeded';
    case 'processing':
      return 'running';
    case 'failed-processing':
      return 'failed';
  }
};

export const getFileDetails = (state: FileState): FileDetails =>
  !isErrorFileState(state)
    ? {
        id: state.id,
        name: state.name,
        size: state.size,
        mimeType: state.mimeType,
        createdAt: state.createdAt,
        mediaType: state.mediaType,
        processingStatus: getProcessingStatusFromFileState(state.status),
      }
    : {
        id: state.id,
      };
