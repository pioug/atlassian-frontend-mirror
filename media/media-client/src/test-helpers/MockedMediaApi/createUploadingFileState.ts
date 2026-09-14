import type { UploadingFileState } from '@atlaskit/media-state/file-state';

import { type ResponseFileItem } from '../../client/media-store/types';

export const createUploadingFileState = (
	{ id, details: { name, size, mediaType, mimeType, createdAt } }: ResponseFileItem,
	progress: number,
	binary?: Blob,
): UploadingFileState => ({
	status: 'uploading',
	progress,
	id,
	name,
	size,
	mediaType,
	mimeType,
	createdAt,
	preview: { value: binary || new Blob(['some-content'], { type: mimeType }) },
});
