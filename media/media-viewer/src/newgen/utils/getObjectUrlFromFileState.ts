import { FileState, isErrorFileState } from '@atlaskit/media-client';

export const getObjectUrlFromFileState = async (
  state: FileState,
): Promise<string | undefined> => {
  if (!isErrorFileState(state)) {
    const { preview } = state;
    if (preview) {
      try {
        return URL.createObjectURL((await preview).value);
      } catch (err) {
        return undefined;
      }
    }
  }
  return undefined;
};
