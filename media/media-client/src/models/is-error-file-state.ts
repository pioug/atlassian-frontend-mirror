import type { FileState, ErrorFileState } from '@atlaskit/media-state/file-state';

export const isErrorFileState = (fileState: FileState): fileState is ErrorFileState =>
	fileState.status === 'error';
