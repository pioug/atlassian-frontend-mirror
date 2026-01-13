import {
	type FileState,
	globalMediaEventEmitter,
	type MediaViewedEventPayload,
} from '@atlaskit/media-client';

const fileAddedListener = (fileState: FileState) => {
	// eslint-disable-next-line no-console
	console.log('file-added -> globalMediaEventEmitter', { fileState });
};

const attachmentViewedListener = (payload: MediaViewedEventPayload) => {
	// eslint-disable-next-line no-console
	console.log('media-viewed -> globalMediaEventEmitter', { payload });
};

export const addGlobalEventEmitterListeners = (): void => {
	globalMediaEventEmitter.off('file-added', fileAddedListener);
	globalMediaEventEmitter.off('media-viewed', attachmentViewedListener);
	globalMediaEventEmitter.on('file-added', fileAddedListener);
	globalMediaEventEmitter.on('media-viewed', attachmentViewedListener);
};
