import type { FileState, ErrorFileState } from '@atlaskit/media-state/file-state';

import type { PreviewableFileState } from './file-state';
import { isErrorFileState } from './is-error-file-state';

export const isPreviewableFileState = (
	fileState: FileState,
): fileState is Exclude<FileState, ErrorFileState> & PreviewableFileState =>
	!isErrorFileState(fileState) && !!fileState.preview;
