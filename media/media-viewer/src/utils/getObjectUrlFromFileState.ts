import { isErrorFileState } from '@atlaskit/media-client';
import type { FileState } from '@atlaskit/media-state/file-state';

export const getObjectUrlFromFileState = async (state: FileState): Promise<string | undefined> => {
	if (!isErrorFileState(state)) {
		const { preview } = state;
		if (preview) {
			try {
				// @ts-expect-error
				return URL.createObjectURL((await preview).value);
			} catch (err) {
				return undefined;
			}
		}
	}
	return undefined;
};
