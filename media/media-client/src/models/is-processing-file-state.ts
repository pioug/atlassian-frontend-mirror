import type { FileState, ProcessingFileState } from '@atlaskit/media-state/file-state';

export const isProcessingFileState = (fileState: FileState): fileState is ProcessingFileState =>
	fileState.status === 'processing';
