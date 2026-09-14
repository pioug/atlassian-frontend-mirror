import type {
	FileState,
	ErrorFileState,
	ProcessedFileState,
	ProcessingFailedState,
} from '@atlaskit/media-state/file-state';

export const isFinalFileState = (
	fileState: FileState,
): fileState is ProcessedFileState | ErrorFileState | ProcessingFailedState =>
	['processed', 'failed-processing', 'error'].includes(fileState.status);
