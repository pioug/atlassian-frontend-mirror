import type { MediaViewedEventPayload } from '@atlaskit/media-client/events';
import { globalMediaEventEmitter } from '@atlaskit/media-client/global-media-event-emitter';
import type { FileState } from '@atlaskit/media-state/file-state';

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
