import { FileState, isErrorFileState, MediaType } from '..';

export const overrideMediaTypeIfUnknown = (
  fileState: FileState,
  mediaType?: MediaType,
): { mediaType?: MediaType } => {
  if (!isErrorFileState(fileState) && fileState.mediaType === 'unknown') {
    return { mediaType };
  }
  return {};
};
