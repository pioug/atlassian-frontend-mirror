import { isErrorFileState } from '../models/file-state';
import { type FileState } from '@atlaskit/media-state';
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
