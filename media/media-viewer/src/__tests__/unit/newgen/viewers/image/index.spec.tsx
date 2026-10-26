import React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import type { MediaTraceContext } from '@atlaskit/media-common/analytics/types';
import { getRandomTelemetryId } from '@atlaskit/media-common/helpers';
import type { ProcessedFileState } from '@atlaskit/media-state/file-state';
import { awaitError } from '@atlaskit/media-test-helpers/await-error';
import { fakeMediaClient } from '@atlaskit/media-test-helpers/fakeMediaClient';
import { asMockFunction } from '@atlaskit/media-test-helpers/jestHelpers';
import { ffTest } from '@atlassian/feature-flags-test-utils/test-runner';

import * as buildImgErrorDiagnosticsModule from '../../../../../buildImgErrorDiagnostics';
import { getErrorDetail } from '../../../../../getErrorDetail';
import { getSecondaryErrorReason } from '../../../../../getSecondaryErrorReason';
import { MediaViewerError } from '../../../../../MediaViewerError';
import { ImageViewer, type ImageViewerProps } from '../../../../../viewers/image';
import {
	clearWarmedImages,
	getWarmedImageKey,
	hasWarmedImage,
	setWarmedImage,
} from '../../../../../warmedImages';

// Some tests below replace the global with a stub, so keep the real one for warm-ups.
const RealAbortController = AbortController;

const collectionName = 'some-collection';
const imageItem: ProcessedFileState = {
	id: 'some-id',
	status: 'processed',
	name: 'my image',
	size: 11222,
	mediaType: 'image',
	mimeType: 'image/jpeg',
	artifacts: {},
	representations: {
		image: {},
	},
};

const traceContext: MediaTraceContext = {
	traceId: getRandomTelemetryId(),
};

function setup(
	response: Promise<Blob>,
	props?: Partial<ImageViewerProps>,
	getImageWatermarkVersion: () => Promise<string | undefined> = () => Promise.resolve(undefined),
) {
	const mediaClient = fakeMediaClient();
	asMockFunction(mediaClient.getImage).mockReturnValue(response);
	asMockFunction(mediaClient.file.getFileBinaryURL).mockResolvedValue('some-binary-url');
	asMockFunction(mediaClient.getClientId).mockResolvedValue(undefined);
	asMockFunction(mediaClient.getImageWatermarkVersion).mockImplementation(getImageWatermarkVersion);
	const onClose = jest.fn();
	const onLoaded = jest.fn();
	const onError = jest.fn();

	const component = render(
		<IntlProvider locale="en">
			<ImageViewer
				mediaClient={mediaClient}
				item={imageItem}
				collectionName={collectionName}
				onClose={onClose}
				onLoad={onLoaded}
				onError={onError}
				traceContext={traceContext}
				{...props}
			/>
		</IntlProvider>,
	);

	return { mediaClient, component, onClose, onLoaded, onError };
}

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('ImageViewer', () => {
	describe('unsupported MIME routing (platform_media_unsupported_mime_routing)', () => {
		ffTest.on(
			'platform_media_unsupported_mime_routing',
			'when unsupported MIME routing is enabled',
			() => {
				it('fails fast with `imageviewer-unsupported-mime` when the fetched blob is a non-decodable image type', async () => {
					// Declared unsupported and JIT transformation did not change it.
					const response = Promise.resolve(new Blob([], { type: 'image/heic' }));
					const { mediaClient, onError } = setup(response, {
						item: {
							...imageItem,
							mimeType: 'image/heic',
						},
					});

					await waitFor(() => expect(onError).toHaveBeenCalled());
					const error = onError.mock.calls[0][0] as MediaViewerError;
					expect(error).toBeInstanceOf(MediaViewerError);
					expect(error.primaryReason).toBe('imageviewer-unsupported-mime');
					// Should not render a doomed <img> for the undecodable blob
					expect(screen.queryByTestId('media-viewer-image')).not.toBeInTheDocument();
					// Should not waste a binary URL fetch
					expect(mediaClient.file.getFileBinaryURL).not.toHaveBeenCalled();
				});

				it('routes to unsupported when the declared type is supported but the fetched blob is not', async () => {
					// JIT transformation produced (or left) an undecodable type even though
					// the declared mimeType from /items looked fine.
					const response = Promise.resolve(new Blob([], { type: 'image/tiff' }));
					const { mediaClient, onError } = setup(response, {
						item: {
							...imageItem,
							mimeType: 'image/jpeg',
						},
					});

					await waitFor(() => expect(onError).toHaveBeenCalled());
					const error = onError.mock.calls[0][0] as MediaViewerError;
					expect(error.primaryReason).toBe('imageviewer-unsupported-mime');
					expect(screen.queryByTestId('media-viewer-image')).not.toBeInTheDocument();
					expect(mediaClient.file.getFileBinaryURL).not.toHaveBeenCalled();
				});

				it('renders the <img> when JIT transformation produced a decodable type despite an unsupported declared type', async () => {
					// Declared unsupported (e.g. TIFF) but JIT transformed it to a decodable JPEG.
					const response = Promise.resolve(new Blob([], { type: 'image/jpeg' }));
					const { onError } = setup(response, {
						item: {
							...imageItem,
							mimeType: 'image/tiff',
						},
					});

					await waitFor(() =>
						expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument(),
					);
					expect(screen.getByTestId('media-viewer-image')).toBeInTheDocument();
					expect(onError).not.toHaveBeenCalled();
				});

				it('still renders the <img> for decodable image types', async () => {
					const response = Promise.resolve(new Blob([], { type: 'image/png' }));
					const { onError } = setup(response, {
						item: {
							...imageItem,
							mimeType: 'image/png',
						},
					});

					await waitFor(() =>
						expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument(),
					);
					expect(screen.getByTestId('media-viewer-image')).toBeInTheDocument();
					expect(onError).not.toHaveBeenCalled();
				});

				it('falls back to the declared mimeType when the fetched blob has no type', async () => {
					// e.g. a preview provided as a plain URL string, or a blob with an empty type.
					const response = Promise.resolve(new Blob());
					const { onError } = setup(response, {
						item: {
							...imageItem,
							mimeType: 'image/heic',
						},
					});

					await waitFor(() => expect(onError).toHaveBeenCalled());
					const error = onError.mock.calls[0][0] as MediaViewerError;
					expect(error.primaryReason).toBe('imageviewer-unsupported-mime');
				});
			},
		);

		ffTest.off(
			'platform_media_unsupported_mime_routing',
			'when unsupported MIME routing is disabled',
			() => {
				it('does not route non-decodable image types (legacy behaviour)', async () => {
					const response = Promise.resolve(new Blob([], { type: 'image/heic' }));
					const { onError } = setup(response, {
						item: {
							...imageItem,
							mimeType: 'image/heic',
						},
					});

					await waitFor(() =>
						expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument(),
					);
					// Legacy path still hands the blob to <img>; no fail-fast error from init()
					expect(onError).not.toHaveBeenCalledWith(
						expect.objectContaining({ primaryReason: 'imageviewer-unsupported-mime' }),
					);
					expect(screen.getByTestId('media-viewer-image')).toBeInTheDocument();
				});
			},
		);
	});

	it('assigns an object url for images when successful', async () => {
		const response = Promise.resolve(new Blob());
		setup(response);

		await waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());

		const imageElm = screen.getByTestId('media-viewer-image');
		expect(imageElm.getAttribute('src')).toBe('mock result of URL.createObjectURL()');
	});

	it('should not try get originalBinaryImageUrl when is local file reference', async () => {
		const response = Promise.resolve(new Blob());
		const { mediaClient } = setup(response, {
			item: {
				...imageItem,
				preview: {
					value: new File([], 'some-file-name'),
					origin: 'local',
				},
			},
		});
		await waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());
		expect(mediaClient.file.getFileBinaryURL).not.toHaveBeenCalled();
	});

	it('should not try get originalBinaryImageUrl when is file is not an image', async () => {
		const response = Promise.resolve(new Blob());
		const { mediaClient } = setup(response, {
			item: {
				...imageItem,
				mediaType: 'unknown',
			},
		});

		await waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());
		expect(mediaClient.file.getFileBinaryURL).not.toHaveBeenCalled();
	});

	it('should not try get originalBinaryImageUrl when has unsupported mime type', async () => {
		const response = Promise.resolve(new Blob());
		const { mediaClient } = setup(response, {
			item: {
				...imageItem,
				mimeType: 'image/heic',
			},
		});

		await waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());
		expect(mediaClient.file.getFileBinaryURL).not.toHaveBeenCalled();
	});

	it('should not update state when image fetch request is cancelled', async () => {
		const abort = jest.fn();
		class FakeAbortController {
			abort = abort;
			signal = {
				aborted: true,
			};
		}
		(global as any).AbortController = FakeAbortController;

		const response = Promise.reject(new Error('Error: User aborted request'));
		setup(response);
		await screen.findByLabelText('Loading file...');

		await awaitError(response, 'Error: User aborted request');

		await screen.findByLabelText('Loading file...');
		// Explicit asssertion required despite checks above, otherwise the test will fail assertion check.
		expect(1).toBe(1);
	});

	it('should not call `onLoad` callback when image fetch request is cancelled', async () => {
		const abort = jest.fn();
		class FakeAbortController {
			abort = abort;
			signal = {
				aborted: true,
			};
		}
		(global as any).AbortController = FakeAbortController;

		const response = Promise.reject(new Error('Error: User aborted request'));
		const { onLoaded } = setup(response);

		expect(onLoaded).not.toHaveBeenCalled();

		await awaitError(response, 'Error: User aborted request');

		expect(onLoaded).not.toHaveBeenCalled();
	});

	it('cancels an image fetch request when unmounted', async () => {
		const abort = jest.fn();
		class FakeAbortController {
			abort = abort;
			signal = {
				aborted: true,
			};
		}
		(global as any).AbortController = FakeAbortController;
		const response: any = new Promise(() => {});
		const { component } = setup(response);

		// Wait for async init operations (getClientId) to complete before unmounting
		await new Promise((resolve) => setTimeout(resolve, 0));

		component.unmount();

		await waitFor(() => {
			expect(abort).toHaveBeenCalled();
		});
	});

	it('revokes an existing object url when unmounted', async () => {
		global.URL.revokeObjectURL = jest.fn();

		const response = Promise.resolve(new Blob());
		const { component } = setup(response);

		// make sure unmount happens after loading finish
		await waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());
		component.unmount();

		await waitFor(() => {
			expect(URL.revokeObjectURL).toHaveBeenCalled();
		});
	});

	it('should call mediaClient.getImage when image representation is present and no preview is present', async () => {
		const response = Promise.resolve(new Blob());
		const { mediaClient } = setup(response);

		await waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());

		expect(mediaClient.getImage).toHaveBeenCalledWith(
			'some-id',
			{
				collection: 'some-collection',
				mode: 'fit',
			},
			expect.anything(),
			true,
			traceContext,
		);
	});

	it('should not call mediaClient.getImage when image representation and a preview is present', async () => {
		const response = Promise.resolve(new Blob());
		const { mediaClient } = setup(response, {
			item: { ...imageItem, preview: { value: new Blob() } },
		});

		await waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());

		expect(mediaClient.getImage).not.toHaveBeenCalled();
	});

	it('should not call mediaClient.getImage when image representation is not present', async () => {
		const response = Promise.resolve(new Blob());
		const { mediaClient } = setup(response, {
			item: {
				...imageItem,
				representations: {},
			},
		});

		expect(mediaClient.getImage).not.toHaveBeenCalled();
	});

	it('MSW-700: clicking on background of ImageViewer does not close it', async () => {
		const response = Promise.resolve(new Blob());
		const {
			component: { container },
			onClose,
		} = setup(response);

		await waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());

		fireEvent.click(container);

		expect(onClose).not.toHaveBeenCalled();
	});

	describe('src onerror diagnostics', () => {
		it('attaches a descriptive secondaryError to imageviewer-src-onerror', async () => {
			const response = Promise.resolve(new Blob());
			const { onError } = setup(response, {
				item: {
					...imageItem,
					mimeType: 'image/png',
				},
			});

			await waitFor(() =>
				expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument(),
			);
			const imageElm = screen.getByTestId('media-viewer-image');
			fireEvent.error(imageElm);

			expect(onError).toHaveBeenCalled();
			const error = onError.mock.calls[0][0] as MediaViewerError;
			expect(error).toBeInstanceOf(MediaViewerError);
			expect(error.primaryReason).toBe('imageviewer-src-onerror');
			expect(error.secondaryError).toBeInstanceOf(Error);
			// errorDetail (downstream analytics) is now descriptive instead of `unknown`
			const detail = getErrorDetail(error);
			expect(detail).not.toBe('unknown');
			expect(detail).toContain('mimeType=image/png');
			expect(detail).toContain('isBrowserDecodable=true');
			expect(detail).toContain('naturalWidth=');
			expect(detail).toContain('failedSrcType=');
			// secondaryReason becomes a concrete `nativeError` instead of `unknown`
			expect(getSecondaryErrorReason(error)).toBe('nativeError');
		});

		it('still emits imageviewer-src-onerror without crashing when diagnostics building throws', async () => {
			// Diagnostics are best-effort: if buildImgErrorDiagnostics throws, onImgError
			// must fall back to no secondaryError rather than turn a handled image error
			// into an unhandled exception.
			const spy = jest
				.spyOn(buildImgErrorDiagnosticsModule, 'buildImgErrorDiagnostics')
				.mockImplementation(() => {
					throw new Error('boom');
				});

			try {
				const response = Promise.resolve(new Blob());
				const { onError } = setup(response, {
					item: {
						...imageItem,
						mimeType: 'image/png',
					},
				});

				await waitFor(() =>
					expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument(),
				);
				const imageElm = screen.getByTestId('media-viewer-image');

				expect(() => fireEvent.error(imageElm)).not.toThrow();

				expect(onError).toHaveBeenCalled();
				const error = onError.mock.calls[0][0] as MediaViewerError;
				expect(error).toBeInstanceOf(MediaViewerError);
				expect(error.primaryReason).toBe('imageviewer-src-onerror');
				// Falls back to the previous opaque reporting when diagnostics fail.
				expect(error.secondaryError).toBeUndefined();
				expect(getErrorDetail(error)).toBe('unknown');
				expect(getSecondaryErrorReason(error)).toBe('unknown');
			} finally {
				spy.mockRestore();
			}
		});
	});

	describe('taking a warmed image', () => {
		const keyFor = (watermarkVersion: string | undefined) =>
			getWarmedImageKey({ id: imageItem.id, collectionName, watermarkVersion });
		const warmedKey = keyFor(undefined);

		const warmUp = (image: Promise<Blob>, key = warmedKey) => {
			const warmed = { image, controller: new RealAbortController() };
			setWarmedImage(key, warmed);
			return warmed;
		};

		const deferredBlob = () => {
			let resolve: (blob: Blob) => void = () => {};
			let reject: (error: Error) => void = () => {};
			const promise = new Promise<Blob>((res, rej) => {
				resolve = res;
				reject = rej;
			});
			return { promise, resolve, reject };
		};

		beforeEach(() => {
			clearWarmedImages();
		});

		afterEach(() => {
			clearWarmedImages();
		});

		it('takes a warm-up instead of issuing a second request', async () => {
			warmUp(Promise.resolve(new Blob()));

			const { mediaClient } = setup(Promise.resolve(new Blob()));

			await waitFor(() =>
				expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument(),
			);

			expect(mediaClient.getImage).not.toHaveBeenCalled();
			expect(hasWarmedImage(warmedKey)).toBe(false);
			expect(screen.getByTestId('media-viewer-image')).toBeInTheDocument();
		});

		it('makes its own request when there is no warm-up, as in the control arm', async () => {
			const { mediaClient } = setup(Promise.resolve(new Blob()));

			await waitFor(() =>
				expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument(),
			);

			expect(mediaClient.getImage).toHaveBeenCalledTimes(1);
			// Nothing to take, so the viewer doesn't resolve the watermark version either.
			expect(mediaClient.getImageWatermarkVersion).not.toHaveBeenCalled();
		});

		describe('watermark version', () => {
			it('leaves the warm-up in the store when closed while the version resolves', async () => {
				const createObjectURL = jest.spyOn(URL, 'createObjectURL');
				const warmed = warmUp(Promise.resolve(new Blob()));
				let resolveVersion: (version: string | undefined) => void = () => {};

				const { mediaClient, component } = setup(
					Promise.resolve(new Blob()),
					undefined,
					() =>
						new Promise((resolve) => {
							resolveVersion = resolve;
						}),
				);
				await waitFor(() => expect(mediaClient.getImageWatermarkVersion).toHaveBeenCalled());

				component.unmount();
				resolveVersion(undefined);
				await new Promise((resolve) => setTimeout(resolve, 0));

				// Not taken by the closed viewer, so the store still aborts it on expiry.
				expect(hasWarmedImage(warmedKey)).toBe(true);
				expect(warmed.controller.signal.aborted).toBe(false);
				expect(createObjectURL).not.toHaveBeenCalled();
				expect(mediaClient.getImage).not.toHaveBeenCalled();
				createObjectURL.mockRestore();
			});

			it('takes a warm-up made with the same watermark version', async () => {
				const key = keyFor('version-1');
				warmUp(Promise.resolve(new Blob()), key);

				const { mediaClient } = setup(Promise.resolve(new Blob()), undefined, () =>
					Promise.resolve('version-1'),
				);

				await waitFor(() =>
					expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument(),
				);

				expect(mediaClient.getImageWatermarkVersion).toHaveBeenCalledWith(collectionName);
				expect(mediaClient.getImage).not.toHaveBeenCalled();
				expect(hasWarmedImage(key)).toBe(false);
			});

			it('makes its own request when the warm-up has an older watermark version', async () => {
				const staleKey = keyFor('version-1');
				warmUp(Promise.resolve(new Blob()), staleKey);

				const { mediaClient } = setup(Promise.resolve(new Blob()), undefined, () =>
					Promise.resolve('version-2'),
				);

				await waitFor(() =>
					expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument(),
				);

				expect(mediaClient.getImage).toHaveBeenCalledTimes(1);
				// Left for the store to expire, never handed to this viewer.
				expect(hasWarmedImage(staleKey)).toBe(true);
			});

			it('makes its own request when the watermark version cannot be resolved', async () => {
				warmUp(Promise.resolve(new Blob()));

				const { mediaClient } = setup(Promise.resolve(new Blob()), undefined, () =>
					Promise.reject(new Error('auth failed')),
				);

				await waitFor(() =>
					expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument(),
				);

				expect(mediaClient.getImage).toHaveBeenCalledTimes(1);
				expect(hasWarmedImage(warmedKey)).toBe(true);
			});
		});

		it('falls back to its own request when a taken warm-up fails', async () => {
			const download = deferredBlob();
			warmUp(download.promise);

			const { mediaClient, onError } = setup(Promise.resolve(new Blob()));
			await waitFor(() => expect(hasWarmedImage(warmedKey)).toBe(false));

			download.reject(new Error('warm-up failed'));

			await waitFor(() =>
				expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument(),
			);
			expect(mediaClient.getImage).toHaveBeenCalledTimes(1);
			expect(onError).not.toHaveBeenCalled();
			expect(screen.getByTestId('media-viewer-image')).toBeInTheDocument();
		});

		it('aborts a taken warm-up and shows nothing when closed mid-download', async () => {
			const createObjectURL = jest.spyOn(URL, 'createObjectURL');
			const download = deferredBlob();
			const warmed = warmUp(download.promise);

			const { mediaClient, component } = setup(Promise.resolve(new Blob()));
			await waitFor(() => expect(hasWarmedImage(warmedKey)).toBe(false));

			component.unmount();
			expect(warmed.controller.signal.aborted).toBe(true);

			download.resolve(new Blob());
			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(createObjectURL).not.toHaveBeenCalled();
			expect(mediaClient.getImage).not.toHaveBeenCalled();
			createObjectURL.mockRestore();
		});
	});

	it('should add file attrs to src if contextId is passed', async () => {
		const response = Promise.resolve(new Blob());
		setup(response, {
			contextId: 'some-context-id',
		});

		await waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());

		const imageElm = screen.getByTestId('media-viewer-image');
		expect(imageElm.getAttribute('src')).toBe(
			'mock result of URL.createObjectURL()#media-blob-url=true&id=some-id&contextId=some-context-id&collection=some-collection&clientId=',
		);
	});
});
