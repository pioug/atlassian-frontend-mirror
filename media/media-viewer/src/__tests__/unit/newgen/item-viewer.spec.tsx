/* Imports */

import React from 'react';
import Loadable from 'react-loadable';
import { generateSampleFileItem } from '@atlaskit/media-test-data';
import {
	createMockedMediaApi,
	createRateLimitedError,
	createServerUnauthorizedError,
} from '@atlaskit/media-client/test-helpers';
import { MockedMediaClientProvider } from '@atlaskit/media-client-react/test-helpers';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';
import * as analytics from '../../../analytics';
import * as ufoWrapper from '../../../analytics/ufoExperiences';
import { ItemViewer } from '../../../item-viewer';
import { createMockedMediaClientProvider } from '../../utils/_mockedMediaClientProvider';

const traceContext = { traceId: 'some-trace-id' };

/* Mocks */

// TODO: https://product-fabric.atlassian.net/browse/CXP-3191
// Mock media-client for CodeViewer since it uses `request` from media-client
jest.mock('@atlaskit/media-client', () => {
	const actualModule = jest.requireActual('@atlaskit/media-client');
	return {
		...actualModule,
		request: jest.fn().mockResolvedValue({
			text: jest.fn().mockResolvedValue('some-src'),
			arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
		}),
	};
});

jest.mock('pdfjs-dist/legacy/build/pdf', () => ({
	__esModule: true,
	getDocument: jest.fn().mockImplementation(() => {
		return jest.fn();
	}),
	GlobalWorkerOptions: {
		workerSrc: '',
	},
	version: '',
}));

jest.mock('pdfjs-dist/legacy/web/pdf_viewer', () => ({
	__esModule: true,
	PDFViewer: jest.fn().mockImplementation(() => {
		return {
			setDocument: jest.fn(),
			firstPagePromise: new Promise(() => {}),
		};
	}),
	EventBus: jest.fn(),
	PDFLinkService: jest.fn().mockImplementation(() => {
		return {
			setDocument: jest.fn(),
			setViewer: jest.fn(),
		};
	}),
}));

/* Jest Spies */

jest.spyOn(analytics, 'fireAnalytics').mockImplementation(() => {});

const mocksucceedMediaFileUfoExperience = jest.spyOn(ufoWrapper, 'succeedMediaFileUfoExperience');

const mockfailMediaFileUfoExperience = jest.spyOn(ufoWrapper, 'failMediaFileUfoExperience');

const mockstartMediaFileUfoExperience = jest.spyOn(ufoWrapper, 'startMediaFileUfoExperience');

describe('<ItemViewer />', () => {
	beforeAll(async () => {
		await Loadable.preloadAll();
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Media Type', () => {
		it('should load image viewer for image', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<IntlProvider locale="en">
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<ItemViewer previewCount={0} identifier={identifier} traceContext={traceContext} />,
					</MockedMediaClientProvider>
				</IntlProvider>,
			);

			expect(await screen.findByTestId('media-viewer-image')).toBeInTheDocument();
		});

		it('should load custom viewer', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);
			const shouldUseCustomRenderer = jest.fn().mockReturnValue(true);
			const renderContent = jest.fn().mockReturnValue(<div data-testid="custom-test-renderer" />);
			render(
				<IntlProvider locale="en">
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<ItemViewer
							previewCount={0}
							identifier={identifier}
							viewerOptions={{ customRenderers: [{ shouldUseCustomRenderer, renderContent }] }}
							traceContext={traceContext}
						/>
					</MockedMediaClientProvider>
				</IntlProvider>,
			);

			expect(await screen.findByTestId('custom-test-renderer')).toBeInTheDocument();
			expect(renderContent).toHaveBeenCalledTimes(1);
		});

		it('should load video viewer for video', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingVideo();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<IntlProvider locale="en">
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<ItemViewer previewCount={0} identifier={identifier} traceContext={traceContext} />,
					</MockedMediaClientProvider>
				</IntlProvider>,
			);

			// check if the loading indicator is shown
			expect(
				screen.getByRole('img', {
					name: /loading file/i,
				}),
			).toBeInTheDocument();

			const playButton = await screen.findByRole('button', {
				name: /play/i,
			});
			expect(playButton).toBeDefined();
		});

		it('should load audio viewer for audio', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingAudioWithoutRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<IntlProvider locale="en">
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<ItemViewer previewCount={0} identifier={identifier} traceContext={traceContext} />,
					</MockedMediaClientProvider>
				</IntlProvider>,
			);

			// check if the loading indicator is shown
			expect(
				screen.getByRole('img', {
					name: /loading file/i,
				}),
			).toBeInTheDocument();

			const playButton = await screen.findByRole('button', {
				name: /play/i,
			});

			// audio viewer always have a cover image
			const defaultCoverImage = screen.getByRole('img', {
				name: /cover/i,
			});

			expect(playButton).toBeDefined();
			expect(defaultCoverImage).toBeDefined();
		});

		it('should load document viewer for document', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithLocalPreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<IntlProvider locale="en">
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<ItemViewer previewCount={0} identifier={identifier} traceContext={traceContext} />,
					</MockedMediaClientProvider>
				</IntlProvider>,
			);

			// check if the loading indicator is shown
			expect(
				screen.getByRole('img', {
					name: /loading file/i,
				}),
			).toBeInTheDocument();

			const pdfContent = await screen.findByTestId('media-viewer-pdf-content');
			expect(pdfContent).toBeInTheDocument();
		});

		it('should load archive viewer for archive', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingArchive();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<IntlProvider locale="en">
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<ItemViewer previewCount={0} identifier={identifier} traceContext={traceContext} />,
					</MockedMediaClientProvider>
				</IntlProvider>,
			);

			// check if the loading indicator is shown
			expect(
				screen.getByRole('img', {
					name: /loading file/i,
				}),
			).toBeInTheDocument();

			const archiveItem = await screen.findByTestId('archive-layout');
			expect(archiveItem).toBeDefined();
		});

		it('should load code viewer for code', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingCode();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<IntlProvider locale="en">
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<ItemViewer previewCount={0} identifier={identifier} traceContext={traceContext} />,
					</MockedMediaClientProvider>
				</IntlProvider>,
			);

			const codeBlock = await screen.findByTestId('code-block');
			expect(codeBlock).toBeInTheDocument();
		});

		it('should load external image', async () => {
			const { mediaApi } = createMockedMediaApi();
			const identifier = {
				mediaItemType: 'external-image',
				dataURI: 'ext-uri',
				name: 'ext',
			} as const;

			render(
				<IntlProvider locale="en">
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<ItemViewer previewCount={0} identifier={identifier} traceContext={traceContext} />,
					</MockedMediaClientProvider>
				</IntlProvider>,
			);

			const img = await screen.findByTestId('media-viewer-image');
			expect(img).toBeInTheDocument();
		});
	});

	describe('Analytics and Error Handling', () => {
		it('should trigger commence event when the viewer mounts', () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<IntlProvider locale="en">
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<ItemViewer previewCount={0} identifier={identifier} traceContext={traceContext} />,
					</MockedMediaClientProvider>
				</IntlProvider>,
			);

			// check if the loading indicator is shown
			expect(
				screen.getByRole('img', {
					name: /loading file/i,
				}),
			).toBeInTheDocument();

			expect(analytics.fireAnalytics).toHaveBeenLastCalledWith(
				expect.objectContaining({
					action: 'commenced',
					actionSubject: 'mediaFile',
					attributes: {
						fileAttributes: {
							fileId: identifier.id,
						},
						traceContext: { traceId: expect.any(String) },
					},
					eventType: 'operational',
				}),
				expect.anything(),
			);

			expect(mockstartMediaFileUfoExperience).toBeCalledTimes(1);
		});

		it('should trigger success event when the file is in uploading state and the viewer loads successfully', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();

			const { MockedMediaClientProvider, uploadItem } = createMockedMediaClientProvider({
				initialItems: fileItem,
			});

			// simulate the file is in uploading state
			uploadItem(fileItem, 0);

			render(
				<IntlProvider locale="en">
					<MockedMediaClientProvider>
						<ItemViewer previewCount={0} identifier={identifier} traceContext={traceContext} />,
					</MockedMediaClientProvider>
				</IntlProvider>,
			);

			// load image
			const img = await screen.findByTestId('media-viewer-image');
			expect(img).toBeDefined();
			fireEvent.load(img);

			expect(analytics.fireAnalytics).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'commenced',
					actionSubject: 'mediaFile',
					attributes: {
						fileAttributes: {
							fileId: identifier.id,
						},
						traceContext: { traceId: expect.any(String) },
					},
					eventType: 'operational',
				}),
				expect.anything(),
			);
			expect(mockstartMediaFileUfoExperience).toBeCalledTimes(1);
			expect(analytics.fireAnalytics).toHaveBeenLastCalledWith(
				expect.objectContaining({
					action: 'loadSucceeded',
					actionSubject: 'mediaFile',
					attributes: {
						fileMimetype: 'image/png',
						fileAttributes: {
							fileId: identifier.id,
							fileMediatype: 'image',
							fileMimetype: 'image/png',
							fileSize: 41811,
						},
						fileMediatype: 'image',
						status: 'success',
						traceContext: { traceId: expect.any(String) },
					},
					eventType: 'operational',
				}),
				expect.anything(),
			);
			expect(mocksucceedMediaFileUfoExperience).toBeCalledWith({
				fileAttributes: {
					fileId: identifier.id,
					fileMediatype: 'image',
					fileMimetype: 'image/png',
					fileSize: 41811,
				},
				fileStateFlags: {
					wasStatusUploading: true,
					wasStatusProcessing: false,
				},
			});
		});

		// TODO: The processItem intermediate state didn’t update correctly in React 18 RTL tests causing wasStatusProcessing is always false.
		//  We need to investigate further and find a better way to mock the intermediate state.
		it.skip('should trigger success event when the file is in processing state and the viewer loads successfully', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();

			const { MockedMediaClientProvider, processItem } = createMockedMediaClientProvider({
				initialItems: fileItem,
			});

			processItem(fileItem, 0);

			render(
				<IntlProvider locale="en">
					<MockedMediaClientProvider>
						<ItemViewer previewCount={0} identifier={identifier} traceContext={traceContext} />,
					</MockedMediaClientProvider>
				</IntlProvider>,
			);

			await waitFor(() => {
				expect(
					screen.getByRole('img', {
						name: /loading file/i,
					}),
				).toBeInTheDocument();
			});

			processItem(fileItem, 1);

			await waitFor(() => {
				expect(
					screen.getByRole('img', {
						name: /loading file/i,
					}),
				).not.toBeVisible();
			});

			const interactiveImg = await screen.findByTestId('media-viewer-image');
			expect(interactiveImg).toBeInTheDocument();
			fireEvent.load(interactiveImg);

			expect(analytics.fireAnalytics).toHaveBeenLastCalledWith(
				expect.objectContaining({
					action: 'loadSucceeded',
					actionSubject: 'mediaFile',
					attributes: {
						fileMimetype: 'image/png',
						fileAttributes: {
							fileId: identifier.id,
							fileMediatype: 'image',
							fileMimetype: 'image/png',
							fileSize: 41811,
						},
						fileMediatype: 'image',
						status: 'success',
						traceContext: { traceId: expect.any(String) },
					},
					eventType: 'operational',
				}),
				expect.anything(),
			);

			expect(mocksucceedMediaFileUfoExperience).toBeCalledWith({
				fileAttributes: {
					fileId: identifier.id,
					fileMediatype: 'image',
					fileMimetype: 'image/png',
					fileSize: 41811,
				},
				fileStateFlags: {
					wasStatusUploading: false,
					wasStatusProcessing: true,
				},
			});
		});

		it('should fire load success when external image loads', async () => {
			const { mediaApi } = createMockedMediaApi();
			const identifier = {
				mediaItemType: 'external-image',
				dataURI: 'ext-uri',
				name: 'ext',
			} as const;
			render(
				<IntlProvider locale="en">
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<ItemViewer previewCount={0} identifier={identifier} traceContext={traceContext} />,
					</MockedMediaClientProvider>
				</IntlProvider>,
			);
			const interactiveImg = await screen.findByTestId('media-viewer-image');
			expect(interactiveImg).toBeInTheDocument();
			fireEvent.load(interactiveImg);

			expect(analytics.fireAnalytics).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'loadSucceeded',
					actionSubject: 'mediaFile',
					attributes: {
						status: 'success',
						fileMimetype: undefined,
						fileAttributes: {
							fileId: 'external-image',
							fileMediatype: undefined,
							fileMimetype: undefined,
							fileSize: undefined,
						},
					},
					eventType: 'operational',
				}),
				expect.anything(),
			);
			expect(mocksucceedMediaFileUfoExperience).toBeCalledWith({
				fileAttributes: {
					fileId: 'external-image',
					fileMediatype: undefined,
					fileMimetype: undefined,
					fileSize: undefined,
				},
				fileStateFlags: {
					wasStatusUploading: false,
					wasStatusProcessing: false,
				},
			});
		});

		it('should fire load fail when external image errors', async () => {
			const fileAttributes = {
				fileId: 'undefined',
				fileMediatype: undefined,
				fileMimetype: undefined,
				fileSize: undefined,
			};

			const errorInfo = {
				failReason: 'imageviewer-external-onerror',
				errorDetail: 'unknown',
				error: 'unknown',
			};

			const { mediaApi } = createMockedMediaApi();

			const identifier = {
				mediaItemType: 'external-image',
				dataURI: 'ext-uri',
				name: 'ext',
			} as const;

			render(
				<IntlProvider locale="en">
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<ItemViewer previewCount={0} identifier={identifier} traceContext={traceContext} />,
					</MockedMediaClientProvider>
				</IntlProvider>,
			);

			const interactiveImg = await screen.findByTestId('media-viewer-image');
			expect(interactiveImg).toBeInTheDocument();
			fireEvent.error(interactiveImg);

			expect(analytics.fireAnalytics).toHaveBeenCalledWith(
				{
					action: 'loadFailed',
					actionSubject: 'mediaFile',
					attributes: {
						...errorInfo,
						status: 'fail',
						filteredMimeType: fileAttributes.fileMimetype,
						fileAttributes,
					},
					eventType: 'operational',
				},
				expect.anything(),
			);

			expect(mockfailMediaFileUfoExperience).toBeCalledWith({
				...errorInfo,
				request: undefined,
				traceContext: undefined,
				fileAttributes,
				filteredMimeType: fileAttributes.fileMimetype,
				fileStateFlags: {
					wasStatusProcessing: false,
					wasStatusUploading: false,
				},
			});
		});

		it('should load error experience when metadata fetching ended with an error', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			// simulate error
			jest.spyOn(mediaApi, 'getItems').mockRejectedValueOnce(createRateLimitedError());

			render(
				<IntlProvider locale="en">
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<ItemViewer previewCount={0} identifier={identifier} traceContext={traceContext} />,
					</MockedMediaClientProvider>
				</IntlProvider>,
			);

			await waitFor(() =>
				expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument(),
			);

			expect(analytics.fireAnalytics).toHaveBeenLastCalledWith(
				{
					eventType: 'operational',
					action: 'loadFailed',
					actionSubject: 'mediaFile',
					attributes: {
						failReason: 'itemviewer-fetch-metadata',
						error: 'serverRateLimited',
						errorDetail: 'unknown',
						fileAttributes: {
							fileId: identifier.id,
							fileMediatype: undefined,
							fileMimetype: undefined,
							fileSize: undefined,
						},
						fileMimetype: undefined,
						request: {
							attempts: 5,
							clientExhaustedRetries: true,
							mediaEnv: 'test-media-env',
							mediaRegion: 'test-media-region',
							statusCode: 429,
							traceContext: {
								spanId: 'some-span',
								traceId: 'some-trace',
							},
						},
						status: 'fail',
						traceContext: undefined,
					},
				},
				expect.anything(),
			);
		});

		it('should load error experience when viewer returned an error', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			// simulate error
			jest
				.spyOn(mediaApi, 'getFileBinaryURL')
				.mockRejectedValueOnce(createServerUnauthorizedError());

			render(
				<IntlProvider locale="en">
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<ItemViewer previewCount={0} identifier={identifier} traceContext={traceContext} />,
					</MockedMediaClientProvider>
				</IntlProvider>,
			);

			// assess error experience
			const errorIcon = await screen.findByRole('img', {
				name: /error loading file/i,
			});
			expect(errorIcon).toBeInTheDocument();

			expect(screen.getByText(/something went wrong\./i)).toBeInTheDocument();

			// check the error attributes
			expect(analytics.fireAnalytics).toHaveBeenLastCalledWith(
				{
					eventType: 'operational',
					action: 'loadFailed',
					actionSubject: 'mediaFile',
					attributes: {
						failReason: 'imageviewer-fetch-url',
						error: 'serverUnauthorized',
						errorDetail: 'unknown',
						fileAttributes: {
							fileId: identifier.id,
							fileMediatype: fileItem.details.mediaType,
							fileMimetype: fileItem.details.mimeType,
							fileSize: fileItem.details.size,
						},
						fileMimetype: 'image/png',
						request: {
							attempts: 5,
							clientExhaustedRetries: true,
							mediaEnv: 'test-media-env',
							mediaRegion: 'test-media-region',
							statusCode: 403,
							traceContext: {
								spanId: 'some-span',
								traceId: 'some-trace',
							},
						},
						status: 'fail',
						traceContext: {
							traceId: 'some-trace-id',
						},
					},
				},
				expect.anything(),
			);
		});

		it('should load error experience when file failed processing', async () => {
			const [fileItem, identifier] = generateSampleFileItem.failedDoc();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<IntlProvider locale="en">
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<ItemViewer previewCount={0} identifier={identifier} traceContext={traceContext} />,
					</MockedMediaClientProvider>
				</IntlProvider>,
			);

			// assess error experience
			const errorText = await screen.findByText(/something went wrong\./i);
			expect(errorText).toBeDefined();
			expect(
				screen.getByRole('img', {
					name: /error loading file/i,
				}),
			).toBeDefined();
			expect(
				screen.getByRole('button', {
					name: /download/i,
				}),
			).toBeDefined();

			// check the error attributes
			expect(analytics.fireAnalytics).toHaveBeenLastCalledWith(
				expect.objectContaining({
					attributes: expect.objectContaining({
						failReason: 'itemviewer-file-failed-processing-status',
						fileAttributes: {
							fileId: identifier.id,
							fileMediatype: fileItem.details.mediaType,
							fileMimetype: fileItem.details.mimeType,
							fileSize: fileItem.details.size,
						},
					}),
				}),
				expect.anything(),
			);
		});

		it('should load error experience when file is unsupported', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingUnknown();

			const { mediaApi } = createMockedMediaApi(fileItem);
			render(
				<IntlProvider locale="en">
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<ItemViewer previewCount={0} identifier={identifier} traceContext={traceContext} />,
					</MockedMediaClientProvider>
				</IntlProvider>,
			);
			const errorExperience = await screen.findByText(/something went wrong\./i);
			expect(errorExperience).toBeDefined();
			expect(
				screen.getByRole('img', {
					name: /error loading file/i,
				}),
			).toBeDefined();
			expect(
				screen.getByRole('button', {
					name: /download/i,
				}),
			).toBeDefined();

			// check the error attributes
			expect(analytics.fireAnalytics).toHaveBeenLastCalledWith(
				expect.objectContaining({
					action: 'previewUnsupported',
					attributes: expect.objectContaining({
						fileAttributes: {
							fileId: identifier.id,
							fileMediatype: fileItem.details.mediaType,
							fileMimetype: fileItem.details.mimeType,
							fileSize: fileItem.details.size,
						},
					}),
				}),
				expect.anything(),
			);
		});

		it('should load error expeience when file size exceeds the limit on code mimetype', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingCodeLarge();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<IntlProvider locale="en">
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<ItemViewer previewCount={0} identifier={identifier} traceContext={traceContext} />,
					</MockedMediaClientProvider>
				</IntlProvider>,
			);

			const errorIcon = await screen.findByRole('img', {
				name: /error loading file/i,
			});
			expect(errorIcon).toBeInTheDocument();

			// check the error attributes
			expect(analytics.fireAnalytics).toHaveBeenLastCalledWith(
				expect.objectContaining({
					attributes: expect.objectContaining({
						failReason: 'codeviewer-file-size-exceeds',
						fileAttributes: {
							fileId: identifier.id,
							fileMediatype: fileItem.details.mediaType,
							fileMimetype: fileItem.details.mimeType,
							fileSize: fileItem.details.size,
						},
					}),
				}),
				expect.anything(),
			);
		});

		it('should load error when Document Viewer has fetch failure', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			jest.spyOn(mediaApi, 'getArtifactURL').mockRejectedValueOnce(createServerUnauthorizedError());

			render(
				<IntlProvider locale="en">
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<ItemViewer previewCount={0} identifier={identifier} traceContext={traceContext} />,
					</MockedMediaClientProvider>
				</IntlProvider>,
			);

			// assess error experience
			const errorIcon = await screen.findByRole('img', {
				name: /error loading file/i,
			});
			expect(errorIcon).toBeInTheDocument();

			expect(screen.getByText(/something went wrong\./i)).toBeInTheDocument();

			// check the error attributes
			expect(analytics.fireAnalytics).toHaveBeenLastCalledWith(
				{
					action: 'loadFailed',
					actionSubject: 'mediaFile',
					attributes: {
						error: 'serverUnauthorized',
						errorDetail: 'unknown',
						failReason: 'docviewer-fetch-url',
						fileAttributes: {
							fileId: identifier.id,
							fileMediatype: fileItem.details.mediaType,
							fileMimetype: fileItem.details.mimeType,
							fileSize: fileItem.details.size,
						},
						fileMimetype: 'application/pdf',
						request: {
							attempts: 5,
							clientExhaustedRetries: true,
							mediaEnv: 'test-media-env',
							mediaRegion: 'test-media-region',
							statusCode: 403,
							traceContext: {
								spanId: 'some-span',
								traceId: 'some-trace',
							},
						},
						status: 'fail',
						traceContext: undefined,
					},
					eventType: 'operational',
				},
				expect.anything(),
			);
		});

		it('should load error when Video Viewer has playback failure', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingVideo();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<IntlProvider locale="en">
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<ItemViewer previewCount={0} identifier={identifier} traceContext={traceContext} />,
					</MockedMediaClientProvider>
				</IntlProvider>,
			);

			await waitFor(() =>
				expect(document.querySelector('[data-testid="custom-media-player"]')).toBeInTheDocument(),
			);

			const video = document.querySelector('video') as HTMLVideoElement;
			fireEvent.error(video);

			// assess error experience
			const errorIcon = await screen.findByRole('img', {
				name: /error loading file/i,
			});
			expect(errorIcon).toBeInTheDocument();

			expect(screen.getByText(/something went wrong\./i)).toBeInTheDocument();

			// check the error attributes
			expect(analytics.fireAnalytics).toHaveBeenLastCalledWith(
				expect.objectContaining({
					attributes: expect.objectContaining({
						failReason: 'videoviewer-playback',
						fileAttributes: {
							fileId: identifier.id,
							fileMediatype: fileItem.details.mediaType,
							fileMimetype: fileItem.details.mimeType,
							fileSize: fileItem.details.size,
						},
					}),
				}),
				expect.anything(),
			);
		});

		it('should load error when Audio Viewer has playback failure', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingAudioWithoutRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<IntlProvider locale="en">
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<ItemViewer previewCount={0} identifier={identifier} traceContext={traceContext} />,
					</MockedMediaClientProvider>
				</IntlProvider>,
			);

			await waitFor(() =>
				expect(document.querySelector('[data-testid="custom-media-player"]')).toBeInTheDocument(),
			);

			const audio = document.querySelector('audio') as HTMLAudioElement;
			fireEvent.error(audio);

			// assess error experience
			const errorIcon = await screen.findByRole('img', {
				name: /error loading file/i,
			});
			expect(errorIcon).toBeInTheDocument();

			expect(screen.getByText(/something went wrong\./i)).toBeInTheDocument();

			// check the error attributes
			expect(analytics.fireAnalytics).toHaveBeenLastCalledWith(
				expect.objectContaining({
					attributes: expect.objectContaining({
						failReason: 'audioviewer-playback',
						fileAttributes: {
							fileId: identifier.id,
							fileMediatype: fileItem.details.mediaType,
							fileMimetype: fileItem.details.mimeType,
							fileSize: fileItem.details.size,
						},
					}),
				}),
				expect.anything(),
			);
		});
	});

	it('should load document viewer if mimeType type is pdf and status is failed-processing', async () => {
		const [fileItem, identifier] = generateSampleFileItem.passwordPdf();

		const { mediaApi } = createMockedMediaApi(fileItem);
		render(
			<IntlProvider locale="en">
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<ItemViewer previewCount={0} identifier={identifier} traceContext={traceContext} />,
				</MockedMediaClientProvider>
			</IntlProvider>,
		);
		const pdfContent = await screen.findByTestId('media-viewer-pdf-content');
		expect(pdfContent).toBeDefined();
	});
});
