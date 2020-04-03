import {
  FileState,
  globalMediaEventEmitter,
  MediaViewedEventPayload,
} from '@atlaskit/media-client';

const fileAddedListener = (fileState: FileState) => {
  // eslint-disable-next-line no-console
  console.log('file-added -> globalMediaEventEmitter', { fileState });
};

const attachmentViewedListener = (payload: MediaViewedEventPayload) => {
  // eslint-disable-next-line no-console
  console.log('media-viewed -> globalMediaEventEmitter', { payload });
};

export const addGlobalEventEmitterListeners = () => {
  globalMediaEventEmitter.off('file-added', fileAddedListener);
  globalMediaEventEmitter.off('media-viewed', attachmentViewedListener);
  globalMediaEventEmitter.on('file-added', fileAddedListener);
  globalMediaEventEmitter.on('media-viewed', attachmentViewedListener);
};
