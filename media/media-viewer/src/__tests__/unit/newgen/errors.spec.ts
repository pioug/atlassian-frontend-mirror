import {
	type MediaClientError,
	type MediaClientErrorReason,
	MediaStoreError,
	RequestError,
} from '@atlaskit/media-client';
import {
	MediaViewerError,
	buildVideoErrorDiagnostics,
	getPrimaryErrorReason,
	getSecondaryErrorReason,
	getErrorDetail,
	getRequestMetadata,
	type MediaViewerErrorReason,
	type ArchiveViewerErrorReason,
} from '../../../../src/errors';
import { type FileState } from '@atlaskit/media-state/file-state';

describe('Errors', () => {
	const MVError = (
		primaryErrorReason: MediaViewerErrorReason | ArchiveViewerErrorReason,
		secondaryError?: Error,
	) => new MediaViewerError(primaryErrorReason, secondaryError);

	const MCError = (reason: MediaClientErrorReason) => {
		const error = new Error(reason) as any;
		error.attributes = { reason };
		error.reason = reason;
		return error as MediaClientError<any>;
	};

	describe('Primary error reason', () => {
		it('should detect media-viewer primary reason from MediaViewerError', () => {
			expect(getPrimaryErrorReason(MVError('docviewer-fetch-url'))).toEqual('docviewer-fetch-url');
		});
	});

	describe('Secondary error reason', () => {
		it('should detect nativeError reason from MediaViewerError with native secondary error', () => {
			expect(
				getSecondaryErrorReason(MVError('docviewer-fetch-url', new Error('some-error'))),
			).toEqual('nativeError');
		});

		it('should detect media-client secondary error reason', () => {
			expect(
				getSecondaryErrorReason(MVError('imageviewer-fetch-url', MCError('invalidFileId'))),
			).toEqual('invalidFileId');
		});

		it('should detect nativeError from native error', () => {
			expect(
				getSecondaryErrorReason(MVError('imageviewer-fetch-url', new Error('some-error'))),
			).toEqual('nativeError');
		});
	});

	describe('Error Detail', () => {
		it('should detect error details for MediaViewerErrors', () => {
			expect(
				getErrorDetail(MVError('imageviewer-fetch-url', new Error('some-error-message'))),
			).toBe('some-error-message');
		});

		it('should pass innerError message for RequestError', () => {
			expect(
				getErrorDetail(
					MVError(
						'imageviewer-fetch-url',
						new RequestError('serverInvalidBody', {}, new Error('some-error-message')),
					),
				),
			).toEqual('some-error-message');
		});

		it('should pass innerError message for MediaStoreError', () => {
			expect(
				getErrorDetail(
					MVError(
						'imageviewer-fetch-url',
						new MediaStoreError('failedAuthProvider', new Error('some-error-message')),
					),
				),
			).toEqual('some-error-message');
		});

		it('should detect unknown for non-nativeError detail of MediaViewerErrors', () => {
			expect(getErrorDetail(MVError('imageviewer-fetch-url'))).toBe('unknown');
		});

		it('should detect unknown for non-nativeError detail', () => {
			expect(getErrorDetail(new Error('some-error') as MediaViewerError)).toBe('unknown');
		});
	});

	describe('Request metadata', () => {
		it('should detect request metadata for RequestError', () => {
			expect(
				getRequestMetadata(
					MVError(
						'imageviewer-fetch-url',
						new RequestError('serverForbidden', {
							method: 'GET',
							endpoint: '/some-endpoint',
						}),
					),
				),
			).toStrictEqual({ method: 'GET', endpoint: '/some-endpoint' });
		});

		it('should detect undefined for non-nativeError detail of MediaViewerErrors', () => {
			expect(getRequestMetadata(MVError('imageviewer-fetch-url'))).toBeUndefined();
		});

		it('should detect undefined for non-native errors', () => {
			expect(getRequestMetadata(new Error('some-error') as MediaViewerError)).toBeUndefined();
		});
	});

	describe('buildVideoErrorDiagnostics', () => {
		const processedItem = (overrides: Partial<FileState> = {}): FileState =>
			({
				status: 'processed',
				id: 'some-id',
				name: 'video.mp4',
				size: 12345,
				mediaType: 'video',
				mimeType: 'video/mp4',
				artifacts: {},
				representations: {},
				...overrides,
			}) as FileState;

		const mediaError = (code: number, message = ''): MediaError =>
			({ code, message }) as MediaError;

		it('captures native MediaError.code, its readable name and file context', () => {
			const detail = buildVideoErrorDiagnostics(
				processedItem({ mimeType: 'video/x-matroska', size: 734003200 }),
				mediaError(3),
			).message;

			expect(detail).not.toBe('unknown');
			expect(detail).toContain('mediaErrorCode=3');
			expect(detail).toContain('mediaErrorName=MEDIA_ERR_DECODE');
			expect(detail).toContain('mimeType=video/x-matroska');
			// matroska (.mkv) is not natively browser-playable
			expect(detail).toContain('isBrowserPlayable=false');
			expect(detail).toContain('fileSize=734003200');
		});

		it('reports a meaningful secondaryReason instead of unknown', () => {
			const error = new MediaViewerError(
				'videoviewer-playback',
				buildVideoErrorDiagnostics(processedItem(), mediaError(2)),
			);
			expect(getSecondaryErrorReason(error)).toBe('nativeError');
			expect(getErrorDetail(error)).toContain('mediaErrorCode=2');
			expect(getErrorDetail(error)).toContain('mediaErrorName=MEDIA_ERR_NETWORK');
		});

		it('marks natively playable mp4 as isBrowserPlayable=true', () => {
			const detail = buildVideoErrorDiagnostics(
				processedItem({ mimeType: 'video/mp4' }),
				mediaError(4),
			).message;
			expect(detail).toContain('isBrowserPlayable=true');
			expect(detail).toContain('mediaErrorName=MEDIA_ERR_SRC_NOT_SUPPORTED');
		});

		it('includes native message when present', () => {
			const detail = buildVideoErrorDiagnostics(
				processedItem(),
				mediaError(3, 'PIPELINE_ERROR_DECODE'),
			).message;
			expect(detail).toContain('mediaErrorMessage=PIPELINE_ERROR_DECODE');
		});

		it('omits undefined fields when no MediaError is supplied', () => {
			const detail = buildVideoErrorDiagnostics(processedItem()).message;
			expect(detail).not.toContain('mediaErrorCode');
			expect(detail).not.toContain('mediaErrorName');
			expect(detail).not.toContain('mediaErrorMessage');
			// file context is still captured
			expect(detail).toContain('mimeType=video/mp4');
		});

		it('does not leak mimeType/size from an ErrorFileState', () => {
			const errorItem = { status: 'error', id: 'x', message: 'boom' } as unknown as FileState;
			const detail = buildVideoErrorDiagnostics(errorItem, mediaError(2)).message;
			expect(detail).toContain('mediaErrorCode=2');
			expect(detail).not.toContain('mimeType=');
			expect(detail).not.toContain('fileSize=');
		});
	});
});
