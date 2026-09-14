import type { FileState, ProcessedFileState } from '@atlaskit/media-state/file-state';

export const isProcessedFileState = (fileState: FileState): fileState is ProcessedFileState =>
	fileState.status === 'processed';
