import type { FileState } from '@atlaskit/media-state/file-state';

import { mapMediaFileToFileState } from './map-media-file-to-file-state';
import { type MediaItemDetails } from './media';

export const mapMediaItemToFileState = (id: string, item: MediaItemDetails): FileState => {
	return mapMediaFileToFileState({
		data: {
			id,
			...item,
		},
	});
};
