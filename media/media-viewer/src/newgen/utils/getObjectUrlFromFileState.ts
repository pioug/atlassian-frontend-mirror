import { FileState } from '@atlaskit/media-client';

export const getObjectUrlFromFileState = async (
  state: FileState,
): Promise<string | undefined> => {
  if (state.status !== 'error') {
    const { preview } = state;
    if (preview) {
      return URL.createObjectURL((await preview).value);
    }
  }
  return undefined;
};
