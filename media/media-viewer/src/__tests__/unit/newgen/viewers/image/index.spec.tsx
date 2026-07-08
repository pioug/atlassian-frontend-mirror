import React from 'react';

import { type ProcessedFileState } from '@atlaskit/media-client';
import { awaitError, fakeMediaClient, asMockFunction } from '@atlaskit/media-test-helpers';
import { IntlProvider } from 'react-intl';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { getRandomTelemetryId, type MediaTraceContext } from '@atlaskit/media-common';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { ImageViewer, type ImageViewerProps } from '../../../../../viewers/image';
import { MediaViewerError, getErrorDetail, getSecondaryErrorReason } from '../../../../../errors';
import * as errorsModule from '../../../../../errors';

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

function setup(response: Promise<Blob>, props?: Partial<ImageViewerProps>) {
	const mediaClient = fakeMediaClient();
	asMockFunction(mediaClient.getImage).mockReturnValue(response);
	asMockFunction(mediaClient.file.getFileBinaryURL).mockResolvedValue('some-binary-url');
	asMockFunction(mediaClient.getClientId).mockResolvedValue(undefined);
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
				it('fails fast with `imageviewer-unsupported-mime` for a non-decodable image type', async () => {
					const response = Promise.resolve(new Blob());
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

				it('still renders the <img> for decodable image types', async () => {
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
					expect(screen.getByTestId('media-viewer-image')).toBeInTheDocument();
					expect(onError).not.toHaveBeenCalled();
				});
			},
		);

		ffTest.off(
			'platform_media_unsupported_mime_routing',
			'when unsupported MIME routing is disabled',
			() => {
				it('does not route non-decodable image types (legacy behaviour)', async () => {
					const response = Promise.resolve(new Blob());
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
			const spy = jest.spyOn(errorsModule, 'buildImgErrorDiagnostics').mockImplementation(() => {
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
