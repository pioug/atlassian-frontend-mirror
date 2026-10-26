import type { MediaClient } from '@atlaskit/media-client/media-client';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { wasExperimentExposed } from '@atlassian/experiment-test-utils/was-experiment-exposed';

import { preloadMediaViewer } from '../../../preload';
import {
	getImageViewerRequestParams,
	IMAGE_VIEWER_FETCH_MAX_RES,
} from '../../../viewers/image/imageRequestParams';
import {
	clearWarmedImages,
	getWarmedImageKey,
	hasWarmedImage,
	takeWarmedImage,
} from '../../../warmedImages';

// The chunks are dynamically imported by the preload path. Stub them so the
// tests do not pull the whole viewer tree in just to assert a warm-up happened.
jest.mock('../../../components/media-viewer-error-boundary', () => ({
	MediaViewerWithErrorBoundary: () => null,
}));
jest.mock('../../../viewers/image', () => ({
	ImageViewer: class {},
}));

const EXPERIMENT = 'platform_media_viewer_preload_on_hover';

const createMediaClient = () =>
	({
		getImage: jest.fn().mockResolvedValue(new Blob()),
		getImageWatermarkVersion: jest.fn().mockResolvedValue(undefined),
	}) as unknown as MediaClient & {
		getImage: jest.Mock;
		getImageWatermarkVersion: jest.Mock;
	};

const fileIdentifier = (id: string) =>
	({
		id,
		mediaItemType: 'file',
		collectionName: 'some-collection',
	}) as const;

const keyOf = (
	{ id, collectionName }: ReturnType<typeof fileIdentifier>,
	watermarkVersion?: string,
) => getWarmedImageKey({ id, collectionName, watermarkVersion });

// The image request starts once the watermark version resolves.
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

// Warmed images live on `globalThis` across tests, so every test uses its own file
// id on top of clearing the store.
let nextId = 0;
const uniqueId = () => `file-${(nextId += 1)}`;

describe('preloadMediaViewer', () => {
	beforeEach(() => {
		clearWarmedImages();
	});

	it('exposes the control arm on hover and then does nothing', async () => {
		mockExpDisabled(EXPERIMENT);
		const getMediaClient = jest.fn(createMediaClient);
		const identifier = fileIdentifier(uniqueId());

		preloadMediaViewer({
			getMediaClient,
			identifier,
			mediaType: 'image',
		});
		await flush();

		expect(wasExperimentExposed(EXPERIMENT)).toBe(true);
		expect(getMediaClient).not.toHaveBeenCalled();
		expect(hasWarmedImage(keyOf(identifier))).toBe(false);
	});

	it('exposes the treatment arm on the same hover', () => {
		mockExpEnabled(EXPERIMENT);
		const mediaClient = createMediaClient();

		preloadMediaViewer({
			getMediaClient: () => mediaClient,
			identifier: fileIdentifier(uniqueId()),
			mediaType: 'doc',
		});

		// Exposed even though a doc gets no image warm-up, as in control.
		expect(wasExperimentExposed(EXPERIMENT)).toBe(true);
		expect(mediaClient.getImage).not.toHaveBeenCalled();
	});

	it('warms the image using the same request the image viewer will make', async () => {
		mockExpEnabled(EXPERIMENT);
		const mediaClient = createMediaClient();
		const identifier = fileIdentifier(uniqueId());

		preloadMediaViewer({
			getMediaClient: () => mediaClient,
			identifier,
			mediaType: 'image',
			mimeType: 'image/png',
			traceContext: { traceId: 'trace-1' },
		});
		await flush();

		expect(mediaClient.getImage).toHaveBeenCalledWith(
			identifier.id,
			getImageViewerRequestParams(identifier.collectionName),
			expect.any(AbortController),
			IMAGE_VIEWER_FETCH_MAX_RES,
			{ traceId: 'trace-1' },
			// A warm-up is speculative, so it makes one attempt.
			{ retryOptions: { maxAttempts: 1, startTimeoutInMs: 0 } },
		);
	});

	it('derives an image media type from the mime type', async () => {
		mockExpEnabled(EXPERIMENT);
		const mediaClient = createMediaClient();

		preloadMediaViewer({
			getMediaClient: () => mediaClient,
			identifier: fileIdentifier(uniqueId()),
			mimeType: 'image/jpeg',
		});
		await flush();

		expect(mediaClient.getImage).toHaveBeenCalledTimes(1);
	});

	it('warms a given file only once', async () => {
		mockExpEnabled(EXPERIMENT);
		const mediaClient = createMediaClient();
		const identifier = fileIdentifier(uniqueId());

		// All three hovers land before the watermark version resolves.
		preloadMediaViewer({ getMediaClient: () => mediaClient, identifier, mediaType: 'image' });
		preloadMediaViewer({ getMediaClient: () => mediaClient, identifier, mediaType: 'image' });
		preloadMediaViewer({ getMediaClient: () => mediaClient, identifier, mediaType: 'image' });
		await flush();

		expect(mediaClient.getImage).toHaveBeenCalledTimes(1);
	});

	it('exposes the in-flight request so the viewer can reuse it', async () => {
		mockExpEnabled(EXPERIMENT);
		const blob = new Blob();
		const mediaClient = createMediaClient();
		mediaClient.getImage.mockResolvedValue(blob);
		const identifier = fileIdentifier(uniqueId());

		preloadMediaViewer({ getMediaClient: () => mediaClient, identifier, mediaType: 'image' });
		await flush();

		const warmed = takeWarmedImage(keyOf(identifier));
		expect(warmed).toBeDefined();
		await expect(warmed?.image).resolves.toBe(blob);
		// The viewer awaits the same request, so no second one is made.
		expect(mediaClient.getImage).toHaveBeenCalledTimes(1);
	});

	describe('watermark version', () => {
		it('keys the warm-up by the watermark version of its request', async () => {
			mockExpEnabled(EXPERIMENT);
			const mediaClient = createMediaClient();
			mediaClient.getImageWatermarkVersion.mockResolvedValue('WjtFdA');
			const identifier = fileIdentifier(uniqueId());

			preloadMediaViewer({ getMediaClient: () => mediaClient, identifier, mediaType: 'image' });
			await flush();

			expect(mediaClient.getImageWatermarkVersion).toHaveBeenCalledWith(identifier.collectionName);
			expect(hasWarmedImage(keyOf(identifier, 'WjtFdA'))).toBe(true);
			// A viewer that resolves another version, or none, finds nothing to take.
			expect(hasWarmedImage(keyOf(identifier, 'other-version'))).toBe(false);
			expect(hasWarmedImage(keyOf(identifier))).toBe(false);
		});

		it('warms the file again after the watermark version changes', async () => {
			mockExpEnabled(EXPERIMENT);
			const mediaClient = createMediaClient();
			mediaClient.getImageWatermarkVersion
				.mockResolvedValueOnce('version-1')
				.mockResolvedValueOnce('version-2');
			const identifier = fileIdentifier(uniqueId());

			preloadMediaViewer({ getMediaClient: () => mediaClient, identifier, mediaType: 'image' });
			await flush();
			preloadMediaViewer({ getMediaClient: () => mediaClient, identifier, mediaType: 'image' });
			await flush();

			expect(mediaClient.getImage).toHaveBeenCalledTimes(2);
			expect(hasWarmedImage(keyOf(identifier, 'version-2'))).toBe(true);
		});

		it('warms only the chunks when the watermark version cannot be resolved', async () => {
			mockExpEnabled(EXPERIMENT);
			const mediaClient = createMediaClient();
			mediaClient.getImageWatermarkVersion.mockRejectedValue(new Error('auth failed'));
			const identifier = fileIdentifier(uniqueId());

			preloadMediaViewer({ getMediaClient: () => mediaClient, identifier, mediaType: 'image' });
			await flush();

			expect(mediaClient.getImage).not.toHaveBeenCalled();
			expect(hasWarmedImage(keyOf(identifier))).toBe(false);
		});

		it('does not throw into the hover handler when the client lacks the method', async () => {
			mockExpEnabled(EXPERIMENT);
			// As with an older copy of media-client.
			const mediaClient = { getImage: jest.fn() } as unknown as MediaClient & {
				getImage: jest.Mock;
			};

			expect(() =>
				preloadMediaViewer({
					getMediaClient: () => mediaClient,
					identifier: fileIdentifier(uniqueId()),
					mediaType: 'image',
				}),
			).not.toThrow();
			await flush();

			expect(mediaClient.getImage).not.toHaveBeenCalled();
		});
	});

	it('drops a failed warm-up rather than handing it to the viewer', async () => {
		mockExpEnabled(EXPERIMENT);
		const mediaClient = createMediaClient();
		mediaClient.getImage.mockRejectedValueOnce(new Error('offline'));
		const identifier = fileIdentifier(uniqueId());

		preloadMediaViewer({ getMediaClient: () => mediaClient, identifier, mediaType: 'image' });
		await flush();

		expect(hasWarmedImage(keyOf(identifier))).toBe(false);
	});

	it('holds a bounded number of warmed images', async () => {
		mockExpEnabled(EXPERIMENT);
		const mediaClient = createMediaClient();
		const first = fileIdentifier(uniqueId());

		preloadMediaViewer({
			getMediaClient: () => mediaClient,
			identifier: first,
			mediaType: 'image',
		});
		await flush();
		expect(hasWarmedImage(keyOf(first))).toBe(true);

		// Warming further files evicts the oldest, so a page full of hovers cannot
		// accumulate full resolution blobs.
		preloadMediaViewer({
			getMediaClient: () => mediaClient,
			identifier: fileIdentifier(uniqueId()),
			mediaType: 'image',
		});
		preloadMediaViewer({
			getMediaClient: () => mediaClient,
			identifier: fileIdentifier(uniqueId()),
			mediaType: 'image',
		});
		await flush();

		expect(hasWarmedImage(keyOf(first))).toBe(false);
	});

	it('skips external images, which the browser has already loaded', () => {
		mockExpEnabled(EXPERIMENT);
		const mediaClient = createMediaClient();

		preloadMediaViewer({
			getMediaClient: () => mediaClient,
			identifier: { mediaItemType: 'external-image', dataURI: 'https://example.com/cat.png' },
			mediaType: 'image',
		});

		expect(mediaClient.getImage).not.toHaveBeenCalled();
		// Neither arm is exposed for them.
		expect(wasExperimentExposed(EXPERIMENT)).toBe(false);
	});

	it.each([
		['an unknown media type', {}],
		['a non-image media type', { mediaType: 'doc' as const, mimeType: 'application/pdf' }],
		['an SVG, which is rendered by the SVG viewer', { mimeType: 'image/svg+xml' }],
	])('does not warm the image endpoint for %s', async (_, options) => {
		mockExpEnabled(EXPERIMENT);
		const mediaClient = createMediaClient();

		preloadMediaViewer({
			getMediaClient: () => mediaClient,
			identifier: fileIdentifier(uniqueId()),
			...options,
		});
		await flush();

		expect(mediaClient.getImage).not.toHaveBeenCalled();
	});

	describe('when the caller supplies a file state', () => {
		const processingFileState = (
			id: string,
			extra?: { representations?: { image?: object }; preview?: { value: string } },
		) =>
			({
				id,
				status: 'processing',
				name: 'cat.png',
				mediaType: 'image',
				mimeType: 'image/png',
				size: 1,
				...extra,
			}) as const;

		it('waits for the backend image representation before warming', async () => {
			mockExpEnabled(EXPERIMENT);
			const mediaClient = createMediaClient();
			const id = uniqueId();

			preloadMediaViewer({
				getMediaClient: () => mediaClient,
				identifier: fileIdentifier(id),
				mediaType: 'image',
				fileState: processingFileState(id),
			});
			await flush();

			expect(mediaClient.getImage).not.toHaveBeenCalled();
		});

		it('warms once the image representation exists', async () => {
			mockExpEnabled(EXPERIMENT);
			const mediaClient = createMediaClient();
			const id = uniqueId();

			preloadMediaViewer({
				getMediaClient: () => mediaClient,
				identifier: fileIdentifier(id),
				mediaType: 'image',
				fileState: processingFileState(id, { representations: { image: {} } }),
			});
			await flush();

			expect(mediaClient.getImage).toHaveBeenCalledTimes(1);
		});

		it('does not warm a file the viewer will render from its local preview', async () => {
			mockExpEnabled(EXPERIMENT);
			const mediaClient = createMediaClient();
			const id = uniqueId();

			preloadMediaViewer({
				getMediaClient: () => mediaClient,
				identifier: fileIdentifier(id),
				mediaType: 'image',
				fileState: processingFileState(id, {
					representations: { image: {} },
					preview: { value: 'blob:local-preview' },
				}),
			});
			await flush();

			expect(mediaClient.getImage).not.toHaveBeenCalled();
		});
	});

	describe('on a metered connection', () => {
		const setConnection = (connection?: { saveData?: boolean; effectiveType?: string }) => {
			Object.defineProperty(navigator, 'connection', {
				value: connection,
				configurable: true,
				writable: true,
			});
		};

		afterEach(() => {
			setConnection(undefined);
		});

		it.each([
			['data saver is on', { saveData: true }],
			['the connection is slow', { effectiveType: '2g' }],
		])('does not warm the image when %s', async (_, connection) => {
			mockExpEnabled(EXPERIMENT);
			setConnection(connection);
			const mediaClient = createMediaClient();

			preloadMediaViewer({
				getMediaClient: () => mediaClient,
				identifier: fileIdentifier(uniqueId()),
				mediaType: 'image',
			});
			await flush();

			expect(mediaClient.getImage).not.toHaveBeenCalled();
		});

		it('warms the image on a fast connection', async () => {
			mockExpEnabled(EXPERIMENT);
			setConnection({ effectiveType: '4g' });
			const mediaClient = createMediaClient();

			preloadMediaViewer({
				getMediaClient: () => mediaClient,
				identifier: fileIdentifier(uniqueId()),
				mediaType: 'image',
			});
			await flush();

			expect(mediaClient.getImage).toHaveBeenCalledTimes(1);
		});
	});

	it('allows a later attempt when the warm-up request fails', async () => {
		mockExpEnabled(EXPERIMENT);
		const mediaClient = createMediaClient();
		mediaClient.getImage.mockRejectedValueOnce(new Error('offline'));
		const identifier = fileIdentifier(uniqueId());

		preloadMediaViewer({ getMediaClient: () => mediaClient, identifier, mediaType: 'image' });
		await flush();

		preloadMediaViewer({ getMediaClient: () => mediaClient, identifier, mediaType: 'image' });
		await flush();

		expect(mediaClient.getImage).toHaveBeenCalledTimes(2);
	});

	describe('analytics', () => {
		afterEach(() => {
			jest.restoreAllMocks();
		});

		it('reports a failed warm-up as preloadFailed, unsampled', async () => {
			mockExpEnabled(EXPERIMENT);
			jest.spyOn(Math, 'random').mockReturnValue(0.99);
			const mediaClient = createMediaClient();
			mediaClient.getImage.mockRejectedValueOnce(new Error('offline'));
			const onAnalyticsEvent = jest.fn();
			const identifier = fileIdentifier(uniqueId());

			preloadMediaViewer({
				getMediaClient: () => mediaClient,
				identifier,
				mediaType: 'image',
				mimeType: 'image/png',
				onAnalyticsEvent,
			});
			await flush();

			expect(onAnalyticsEvent).toHaveBeenCalledTimes(1);
			expect(onAnalyticsEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					eventType: 'operational',
					actionSubject: 'mediaFile',
					action: 'preloadFailed',
					attributes: expect.objectContaining({
						status: 'fail',
						failReason: 'preload-image-fetch',
						error: 'nativeError',
						errorDetail: 'offline',
						wasTaken: false,
						// The payload is sanitised, and test ids are not UUIDs.
						fileAttributes: {
							fileId: 'INVALID_FILE_ID',
							fileMediatype: 'image',
							fileMimetype: 'image/png',
						},
					}),
				}),
			);
		});

		it('reports how a sampled warm-up ended as preloadEnded', async () => {
			mockExpEnabled(EXPERIMENT);
			jest.spyOn(Math, 'random').mockReturnValue(0);
			const mediaClient = createMediaClient();
			mediaClient.getImage.mockReturnValue(new Promise(() => {}));
			const onAnalyticsEvent = jest.fn();
			const identifier = fileIdentifier(uniqueId());

			preloadMediaViewer({
				getMediaClient: () => mediaClient,
				identifier,
				mediaType: 'image',
				onAnalyticsEvent,
			});
			await flush();
			takeWarmedImage(keyOf(identifier));

			expect(onAnalyticsEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'preloadEnded',
					attributes: expect.objectContaining({
						outcome: 'taken',
						resolved: false,
						isSamplingEnabled: true,
						samplingRate: 0.1,
					}),
				}),
			);
		});

		it('does not report preloadEnded for a warm-up outside the sample', async () => {
			mockExpEnabled(EXPERIMENT);
			jest.spyOn(Math, 'random').mockReturnValue(0.99);
			const mediaClient = createMediaClient();
			mediaClient.getImage.mockReturnValue(new Promise(() => {}));
			const onAnalyticsEvent = jest.fn();
			const identifier = fileIdentifier(uniqueId());

			preloadMediaViewer({
				getMediaClient: () => mediaClient,
				identifier,
				mediaType: 'image',
				onAnalyticsEvent,
			});
			await flush();
			takeWarmedImage(keyOf(identifier));

			expect(onAnalyticsEvent).not.toHaveBeenCalled();
		});

		it('keeps the warm-up working when the analytics callback throws', async () => {
			mockExpEnabled(EXPERIMENT);
			// Sampled, so `preloadEnded` fires on the take and on the eviction below.
			jest.spyOn(Math, 'random').mockReturnValue(0);
			const mediaClient = createMediaClient();
			mediaClient.getImage.mockReturnValue(new Promise(() => {}));
			const onAnalyticsEvent = jest.fn(() => {
				throw new Error('analytics is down');
			});
			const first = fileIdentifier(uniqueId());
			const warm = (identifier: ReturnType<typeof fileIdentifier>) =>
				preloadMediaViewer({
					getMediaClient: () => mediaClient,
					identifier,
					mediaType: 'image',
					onAnalyticsEvent,
				});

			warm(first);
			await flush();
			expect(takeWarmedImage(keyOf(first))).toBeDefined();

			// The third warm-up evicts the oldest, which reports `evicted`.
			warm(fileIdentifier(uniqueId()));
			warm(fileIdentifier(uniqueId()));
			warm(fileIdentifier(uniqueId()));
			await flush();
			expect(onAnalyticsEvent).toHaveBeenCalled();
			// Every warm-up still made its request, including the one that evicted another.
			expect(mediaClient.getImage).toHaveBeenCalledTimes(4);
		});
	});
});
