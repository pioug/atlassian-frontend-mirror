import type { FileState } from '@atlaskit/media-state/file-state';

export const isImageRepresentationReady = (fileState: FileState): boolean => {
	switch (fileState.status) {
		case 'processing':
		case 'processed':
		case 'failed-processing':
			return !!(fileState.representations && fileState.representations.image);
		default:
			return false;
	}
};
