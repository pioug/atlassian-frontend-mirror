import { type ResponseFileItem } from '../../client/media-store/types';

// --------------------------------------------------------
// Utils for creating file descriptors for tests
// --------------------------------------------------------
export const createEmptyFileItem = (id: string, collection?: string): ResponseFileItem => {
	const emptyFileItem: ResponseFileItem = {
		type: 'file',
		id,
		details: {
			mediaType: 'unknown',
			mimeType: 'binary/octet-stream',
			name: '',
			size: 0,
			processingStatus: 'pending',
			artifacts: {},
			representations: {},
			createdAt: 1699488941974,
		},
	};

	if (collection) {
		emptyFileItem.collection = collection;
	}

	return emptyFileItem;
};
