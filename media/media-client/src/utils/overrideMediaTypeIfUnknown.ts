import type { FileState } from '@atlaskit/media-state/file-state';

import { isErrorFileState } from '../models/is-error-file-state';
import { type MediaType } from '../models/media';

export const overrideMediaTypeIfUnknown = (
	fileState: FileState,
	mediaType?: MediaType,
): { mediaType?: MediaType } => {
	if (!isErrorFileState(fileState) && fileState.mediaType === 'unknown') {
		return { mediaType };
	}
	return {};
};
