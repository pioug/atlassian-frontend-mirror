import { type MediaStoreResponse } from '../../../client/media-store';
import { type MediaFile, type MediaItemDetails } from '../../media';
import { mapMediaFileToFileState, mapMediaItemToFileState } from '../../file-state';
import { type ProcessingFailedState } from '@atlaskit/media-state';

describe('mapMediaFileToFileState', () => {
	const baseMediaFile: MediaFile = {
		id: 'some-file-id',
		name: 'test-file',
		size: 1000,
		mediaType: 'image',
		mimeType: 'image/png',
		artifacts: {},
		representations: {},
	};

	it('should map processing status pending to processing state', () => {
		const mediaFile: MediaStoreResponse<MediaFile> = {
			data: {
				...baseMediaFile,
				processingStatus: 'pending',
			},
		};

		const fileState = mapMediaFileToFileState(mediaFile);

		expect(fileState.status).toBe('processing');
		expect(fileState.id).toBe('some-file-id');
	});

	it('should map processing status succeeded to processed state', () => {
		const mediaFile: MediaStoreResponse<MediaFile> = {
			data: {
				...baseMediaFile,
				processingStatus: 'succeeded',
			},
		};

		const fileState = mapMediaFileToFileState(mediaFile);

		expect(fileState.status).toBe('processed');
		expect(fileState.id).toBe('some-file-id');
	});

	it('should map processing status failed to failed-processing state without failReason', () => {
		const mediaFile: MediaStoreResponse<MediaFile> = {
			data: {
				...baseMediaFile,
				processingStatus: 'failed',
			},
		};

		const fileState = mapMediaFileToFileState(mediaFile) as ProcessingFailedState;

		expect(fileState.status).toBe('failed-processing');
		expect(fileState.id).toBe('some-file-id');
		expect(fileState.failReason).toBeUndefined();
	});

	it('should map processing status failed to failed-processing state with failReason', () => {
		const mediaFile: MediaStoreResponse<MediaFile> = {
			data: {
				...baseMediaFile,
				processingStatus: 'failed',
				failReason: 'timeout',
			},
		};

		const fileState = mapMediaFileToFileState(mediaFile) as ProcessingFailedState;

		expect(fileState.status).toBe('failed-processing');
		expect(fileState.id).toBe('some-file-id');
		expect(fileState.failReason).toBe('timeout');
	});

	it('should map processing status failed with different failReason values', () => {
		const failReasons = ['operation-failed', 'timeout', 'unsupported-file-type', 'unknown'] as const;

		failReasons.forEach((failReason) => {
			const mediaFile: MediaStoreResponse<MediaFile> = {
				data: {
					...baseMediaFile,
					processingStatus: 'failed',
					failReason,
				},
			};

			const fileState = mapMediaFileToFileState(mediaFile) as ProcessingFailedState;

			expect(fileState.status).toBe('failed-processing');
			expect(fileState.failReason).toBe(failReason);
		});
	});

	it('should map undefined processing status to processing state', () => {
		const mediaFile: MediaStoreResponse<MediaFile> = {
			data: {
				...baseMediaFile,
				processingStatus: undefined,
			},
		};

		const fileState = mapMediaFileToFileState(mediaFile);

		expect(fileState.status).toBe('processing');
		expect(fileState.id).toBe('some-file-id');
	});
});

describe('mapMediaItemToFileState', () => {
	const baseMediaItem: MediaItemDetails = {
		mediaType: 'image',
		mimeType: 'image/png',
		name: 'test-file',
		processingStatus: 'pending',
		size: 1000,
		artifacts: {},
		representations: {},
	};

	it('should map media item to file state', () => {
		const fileState = mapMediaItemToFileState('some-file-id', baseMediaItem);

		expect(fileState.status).toBe('processing');
		expect(fileState.id).toBe('some-file-id');
	});

	it('should map media item with failed processing status and failReason', () => {
		const mediaItem: MediaItemDetails = {
			...baseMediaItem,
			processingStatus: 'failed',
			failReason: 'timeout',
		};

		const fileState = mapMediaItemToFileState('some-file-id', mediaItem) as ProcessingFailedState;

		expect(fileState.status).toBe('failed-processing');
		expect(fileState.id).toBe('some-file-id');
		expect(fileState.failReason).toBe('timeout');
	});
});
