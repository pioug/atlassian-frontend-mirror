import {
	type ProcessedFileState,
	type ProcessingFileState,
	type UploadingFileState,
	type ErrorFileState,
	type ProcessingFailedState,
	RequestError,
} from '@atlaskit/media-client';
import { getFileAttributes } from '../../../../analytics';
import { MediaViewerError } from '../../../../errors';
import { createLoadFailedEvent } from '../../../../analytics/events/operational/loadFailed';
import { createZipEntryLoadFailedEvent } from '../../../../analytics/events/operational/zipEntryLoadFailed';
import { createDownloadFailedEventPayload } from '../../../../analytics/events/operational/download';

export const processedFile: ProcessedFileState = {
	status: 'processed',
	id: 'some-id',
	name: 'some name',
	size: 100,
	mediaType: 'image',
	mimeType: 'jpg',
	artifacts: {},
	representations: {},
};

export const processingFile: ProcessingFileState = {
	status: 'processing',
	id: 'some-id',
	name: 'some name',
	size: 100,
	mediaType: 'image',
	mimeType: 'jpg',
	representations: {},
};

export const uploadingFile: UploadingFileState = {
	status: 'uploading',
	id: 'some-id',
	name: 'some name',
	size: 100,
	progress: 50,
	mediaType: 'image',
	mimeType: 'jpg',
};

export const fileWithError: ErrorFileState = {
	status: 'error',
	id: 'some-id',
	message: 'some-error',
};

export const processingError: ProcessingFailedState = {
	status: 'failed-processing',
	id: 'some-id',
	name: 'some name',
	size: 100,
	mediaType: 'image',
	mimeType: 'jpg',
	artifacts: {},
	representations: {},
};

const commonFileProperties = {
	fileId: 'some-id',
	fileMediatype: 'image',
	fileMimetype: 'jpg',
	fileSize: 100,
};

describe('getFileAttributes()', () => {
	it('should extract right payload from processed files', () => {
		expect(getFileAttributes(processedFile)).toEqual(commonFileProperties);
	});

	it('should extract right payload from processing files', () => {
		expect(getFileAttributes(processingFile)).toEqual(commonFileProperties);
	});

	it('should extract right payload from uploading files', () => {
		expect(getFileAttributes(uploadingFile)).toEqual(commonFileProperties);
	});

	it('should extract right payload from files that failed to be processed', () => {
		expect(getFileAttributes(processingError)).toEqual(commonFileProperties);
	});

	it('should extract the minimum payload when error', () => {
		expect(getFileAttributes(fileWithError)).toEqual({
			fileId: 'some-id',
		});
	});

	it('should capture errorDetail when nativeError as secondary reason for load fail event', () => {
		expect(
			createLoadFailedEvent(
				processedFile.id,
				new MediaViewerError('imageviewer-fetch-url', new Error('some-error-message')),
				processedFile,
			),
		).toEqual({
			action: 'loadFailed',
			actionSubject: 'mediaFile',
			attributes: {
				error: 'nativeError',
				errorDetail: 'some-error-message',
				failReason: 'imageviewer-fetch-url',
				fileMimetype: processedFile.mimeType,
				fileAttributes: {
					fileId: processedFile.id,
					fileMediatype: processedFile.mediaType,
					fileMimetype: processedFile.mimeType,
					fileSize: processedFile.size,
				},
				status: 'fail',
			},
			eventType: 'operational',
		});
	});

	it('should capture request metadata when requestError as secondary error for load fail event', () => {
		expect(
			createLoadFailedEvent(
				processedFile.id,
				new MediaViewerError(
					'imageviewer-fetch-url',
					new RequestError('serverInvalidBody', {
						method: 'GET',
						endpoint: '/some-endpoint',
						mediaRegion: 'some-region',
						mediaEnv: 'some-env',
					}),
				),
				processedFile,
			),
		).toEqual({
			action: 'loadFailed',
			actionSubject: 'mediaFile',
			attributes: {
				error: 'serverInvalidBody',
				errorDetail: 'unknown',
				failReason: 'imageviewer-fetch-url',
				statusCode: undefined,
				request: {
					method: 'GET',
					endpoint: '/some-endpoint',
					mediaRegion: 'some-region',
					mediaEnv: 'some-env',
				},
				fileMimetype: processedFile.mimeType,
				fileAttributes: {
					fileId: processedFile.id,
					fileMediatype: processedFile.mediaType,
					fileMimetype: processedFile.mimeType,
					fileSize: processedFile.size,
				},
				status: 'fail',
			},
			eventType: 'operational',
		});
	});

	it('should capture errorDetail when nativeError as secondary reason for zip fail event', () => {
		expect(
			createZipEntryLoadFailedEvent(
				{
					id: 'some-id',
					status: 'error',
				},
				new MediaViewerError('imageviewer-fetch-url', new Error('some-error-message')),
			),
		).toEqual({
			action: 'zipEntryLoadFailed',
			actionSubject: 'mediaFile',
			attributes: {
				error: 'nativeError',
				errorDetail: 'some-error-message',
				failReason: 'imageviewer-fetch-url',
				compressedSize: -1,
				size: -1,
				encrypted: false,
				mimeType: 'undefined',
				fileAttributes: {
					fileId: 'some-id',
					fileMediatype: undefined,
					fileMimetype: undefined,
					fileSize: undefined,
					fileSource: undefined,
					fileStatus: undefined,
				},
				status: 'fail',
			},
			eventType: 'operational',
		});
	});

	it('should include statusCode at top level when RequestError has statusCode 403', () => {
		expect(
			createLoadFailedEvent(
				processedFile.id,
				new MediaViewerError(
					'imageviewer-fetch-url',
					new RequestError('serverForbidden', {
						method: 'GET',
						endpoint: '/some-endpoint',
						mediaRegion: 'some-region',
						mediaEnv: 'some-env',
						statusCode: 403,
					}),
				),
				processedFile,
			),
		).toEqual({
			action: 'loadFailed',
			actionSubject: 'mediaFile',
			attributes: {
				error: 'serverForbidden',
				errorDetail: 'unknown',
				failReason: 'imageviewer-fetch-url',
				statusCode: 403,
				request: {
					method: 'GET',
					endpoint: '/some-endpoint',
					mediaRegion: 'some-region',
					mediaEnv: 'some-env',
					statusCode: 403,
				},
				fileMimetype: processedFile.mimeType,
				fileAttributes: {
					fileId: processedFile.id,
					fileMediatype: processedFile.mediaType,
					fileMimetype: processedFile.mimeType,
					fileSize: processedFile.size,
				},
				status: 'fail',
			},
			eventType: 'operational',
		});
	});

	it('should include statusCode at top level when RequestError has statusCode 401', () => {
		expect(
			createLoadFailedEvent(
				processedFile.id,
				new MediaViewerError(
					'imageviewer-fetch-url',
					new RequestError('serverUnauthorized', {
						method: 'GET',
						endpoint: '/some-endpoint',
						mediaRegion: 'some-region',
						mediaEnv: 'some-env',
						statusCode: 401,
					}),
				),
				processedFile,
			),
		).toEqual({
			action: 'loadFailed',
			actionSubject: 'mediaFile',
			attributes: {
				error: 'serverUnauthorized',
				errorDetail: 'unknown',
				failReason: 'imageviewer-fetch-url',
				statusCode: 401,
				request: {
					method: 'GET',
					endpoint: '/some-endpoint',
					mediaRegion: 'some-region',
					mediaEnv: 'some-env',
					statusCode: 401,
				},
				fileMimetype: processedFile.mimeType,
				fileAttributes: {
					fileId: processedFile.id,
					fileMediatype: processedFile.mediaType,
					fileMimetype: processedFile.mimeType,
					fileSize: processedFile.size,
				},
				status: 'fail',
			},
			eventType: 'operational',
		});
	});

	it('should include statusCode at top level when RequestError has statusCode 500', () => {
		expect(
			createLoadFailedEvent(
				processedFile.id,
				new MediaViewerError(
					'imageviewer-fetch-url',
					new RequestError('serverInternalError', {
						method: 'GET',
						endpoint: '/some-endpoint',
						mediaRegion: 'some-region',
						mediaEnv: 'some-env',
						statusCode: 500,
					}),
				),
				processedFile,
			),
		).toEqual({
			action: 'loadFailed',
			actionSubject: 'mediaFile',
			attributes: {
				error: 'serverInternalError',
				errorDetail: 'unknown',
				failReason: 'imageviewer-fetch-url',
				statusCode: 500,
				request: {
					method: 'GET',
					endpoint: '/some-endpoint',
					mediaRegion: 'some-region',
					mediaEnv: 'some-env',
					statusCode: 500,
				},
				fileMimetype: processedFile.mimeType,
				fileAttributes: {
					fileId: processedFile.id,
					fileMediatype: processedFile.mediaType,
					fileMimetype: processedFile.mimeType,
					fileSize: processedFile.size,
				},
				status: 'fail',
			},
			eventType: 'operational',
		});
	});

	describe('createDownloadFailedEventPayload()', () => {
		it('should include statusCode at top level when RequestError has statusCode 403', () => {
			expect(
				createDownloadFailedEventPayload(
					processedFile.id,
					new MediaViewerError(
						'imageviewer-fetch-url',
						new RequestError('serverForbidden', {
							method: 'GET',
							endpoint: '/some-endpoint',
							mediaRegion: 'some-region',
							mediaEnv: 'some-env',
							statusCode: 403,
						}),
					),
					processedFile,
				),
			).toEqual({
				action: 'downloadFailed',
				actionSubject: 'mediaFile',
				attributes: {
					error: 'serverForbidden',
					errorDetail: 'unknown',
					failReason: 'imageviewer-fetch-url',
					statusCode: 403,
					request: {
						method: 'GET',
						endpoint: '/some-endpoint',
						mediaRegion: 'some-region',
						mediaEnv: 'some-env',
						statusCode: 403,
					},
					fileMimetype: processedFile.mimeType,
					fileMediatype: processedFile.mediaType,
					fileAttributes: {
						fileId: processedFile.id,
						fileMediatype: processedFile.mediaType,
						fileMimetype: processedFile.mimeType,
						fileSize: processedFile.size,
					},
					status: 'fail',
					traceContext: undefined,
				},
				eventType: 'operational',
			});
		});
	});
});
