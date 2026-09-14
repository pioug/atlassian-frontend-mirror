import type {
	FileState,
	ProcessedFileState,
	ProcessingFailedState,
} from '@atlaskit/media-state/file-state';

export const isNonErrorFinalFileState = (
	fileState: FileState,
): fileState is ProcessedFileState | ProcessingFailedState =>
	['processed', 'failed-processing'].includes(fileState.status);
