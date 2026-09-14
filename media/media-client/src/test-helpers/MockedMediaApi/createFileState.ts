import type { FileState } from '@atlaskit/media-state/file-state';

import { type ResponseFileItem } from '../../client/media-store/types';

export const createFileState = ({
	id,
	details: {
		name,
		size,
		mediaType,
		mimeType,
		createdAt,
		processingStatus,
		artifacts,
		representations,
	},
}: ResponseFileItem): FileState => ({
	status: processingStatus === 'succeeded' ? 'processed' : 'processing',
	id,
	name,
	size,
	mediaType,
	mimeType,
	createdAt,
	artifacts,
	representations,
});
