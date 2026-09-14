import type { FileState, UploadingFileState } from '@atlaskit/media-state/file-state';

export const isUploadingFileState = (fileState: FileState): fileState is UploadingFileState =>
	fileState.status === 'uploading';
