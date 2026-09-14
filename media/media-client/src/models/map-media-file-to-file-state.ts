import type { FileState } from '@atlaskit/media-state/file-state';

import type { MediaStoreResponse } from '../client/media-store/types';
import { type MediaFile } from './media';

export const mapMediaFileToFileState = (mediaFile: MediaStoreResponse<MediaFile>): FileState => {
	const {
		id,
		name,
		size,
		processingStatus,
		artifacts,
		mediaType,
		mimeType,
		representations,
		createdAt,
		metadataTraceContext,
		hash,
		abuseClassification,
		mediaMetadata,
		failReason,
		previewCdnUrl,
	} = mediaFile.data;
	const baseState = {
		id,
		name,
		size,
		mediaType,
		mimeType,
		artifacts,
		representations,
		createdAt,
		hash,
		metadataTraceContext,
		abuseClassification,
		mediaMetadata,
		previewCdnUrl,
	};

	switch (processingStatus) {
		case 'pending':
		case undefined:
			return {
				...baseState,
				status: 'processing',
			};
		case 'succeeded':
			return {
				...baseState,
				status: 'processed',
			};
		case 'failed':
			return {
				...baseState,
				status: 'failed-processing',
				failReason,
			};
	}
};
