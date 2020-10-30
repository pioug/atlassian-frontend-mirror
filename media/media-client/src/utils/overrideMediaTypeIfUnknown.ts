import { FileState, isErrorFileState } from '../models/file-state';
import { MediaType } from '../models/media';

export const overrideMediaTypeIfUnknown = (
  fileState: FileState,
  mediaType?: MediaType,
): { mediaType?: MediaType } => {
  if (!isErrorFileState(fileState) && fileState.mediaType === 'unknown') {
    return { mediaType };
  }
  return {};
};
