import React from 'react';
import MediaInlineCard from '../../loader';
import { type MediaClientConfig } from '@atlaskit/media-client';
import { generateSampleFileItem } from '@atlaskit/media-test-data/src';
import {
	createMockedMediaApi,
	createServerUnauthorizedError,
} from '@atlaskit/media-client/test-helpers';
import { createMockedMediaClientProvider } from '../../../utils/__tests__/utils/mockedMediaClientProvider/_MockedMediaClientProvider';
import { render, screen, waitFor } from '@testing-library/react';
import * as analyticsModule from '../../../utils/analytics/analytics';
import { MockedMediaClientProvider } from '@atlaskit/media-client-react/test-helpers';
import userEvent from '@testing-library/user-event';
import { ffTest } from '@atlassian/feature-flags-test-utils';

const dummyMediaClientConfig = {} as MediaClientConfig;

describe('<MediaInlineCard />', () => {
	const fireOperationalEvent = jest.spyOn(analyticsModule, 'fireMediaCardEvent');

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should capture and report a11y violations', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
		const { mediaApi } = createMockedMediaApi(fileItem);
		const { container } = render(
			<MockedMediaClientProvider mockedMediaApi={mediaApi}>
				<MediaInlineCard identifier={identifier} mediaClientConfig={dummyMediaClientConfig} />,
			</MockedMediaClientProvider>,
		);

		await expect(container).toBeAccessible();
	});

	it('should render loading view while loading media file', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
		const { mediaApi } = createMockedMediaApi(fileItem);

		render(
			<MockedMediaClientProvider mockedMediaApi={mediaApi}>
				<MediaInlineCard identifier={identifier} mediaClientConfig={dummyMediaClientConfig} />,
			</MockedMediaClientProvider>,
		);
		const element = await screen.findByTestId('media-inline-card-loading-view');
		expect(element).toBeTruthy();
	});

	it('should render loaded view when media loads successfully', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
		const { mediaApi } = createMockedMediaApi(fileItem);

		render(
			<MockedMediaClientProvider mockedMediaApi={mediaApi}>
				<MediaInlineCard identifier={identifier} mediaClientConfig={dummyMediaClientConfig} />,
			</MockedMediaClientProvider>,
		);
		const loadedView = await screen.findByTestId('media-inline-card-loaded-view');
		const title = await screen.findByText(fileItem.details.name);

		expect(loadedView).toBeTruthy();
		expect(title).toBeTruthy();
	});

	it('should render MediaViewer when shouldOpenMediaViewer=true and clicked', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
		const { mediaApi } = createMockedMediaApi(fileItem);

		render(
			<MockedMediaClientProvider mockedMediaApi={mediaApi}>
				<MediaInlineCard
					identifier={identifier}
					mediaClientConfig={dummyMediaClientConfig}
					shouldOpenMediaViewer
				/>
			</MockedMediaClientProvider>,
		);
		const loadedView = await screen.findByTestId('media-inline-card-loaded-view');

		loadedView.click();

		const mediaViewer = await screen.findByTestId('media-viewer-popup');

		expect(mediaViewer).toBeTruthy();
	});

	it('should render MediaViewer when in error state and clicked', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingJpegWithRemotePreview();
		const { mediaApi } = createMockedMediaApi(fileItem);

		jest.spyOn(mediaApi, 'getItems').mockRejectedValue(new Error('some-error'));

		render(
			<MockedMediaClientProvider mockedMediaApi={mediaApi}>
				<MediaInlineCard
					identifier={identifier}
					mediaClientConfig={dummyMediaClientConfig}
					shouldOpenMediaViewer
				/>
			</MockedMediaClientProvider>,
		);
		const erroredView = await screen.findByTestId('media-inline-card-errored-view');

		erroredView.click();

		const mediaViewer = await screen.findByTestId('media-viewer-popup');

		expect(mediaViewer).toBeTruthy();
	});

	it('should render MediaViewer when the file has no name', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingJpegWithRemotePreview();
		// Remove the name from the file item to simulate a file with no name
		// @ts-ignore
		delete fileItem.details.name;
		const { mediaApi } = createMockedMediaApi(fileItem);

		render(
			<MockedMediaClientProvider mockedMediaApi={mediaApi}>
				<MediaInlineCard
					identifier={identifier}
					mediaClientConfig={dummyMediaClientConfig}
					shouldOpenMediaViewer
				/>
			</MockedMediaClientProvider>,
		);

		// Should render errored view when file has no name
		const erroredView = await screen.findByTestId('media-inline-card-errored-view');
		expect(erroredView).toBeTruthy();

		// Click on the errored view to open MediaViewer
		erroredView.click();

		// MediaViewer should be rendered
		const mediaViewer = await screen.findByTestId('media-viewer-popup');
		expect(mediaViewer).toBeTruthy();
	});

	it('should call onClick callback when provided', async () => {
		const onClick = jest.fn();
		const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
		const { mediaApi } = createMockedMediaApi(fileItem);

		render(
			<MockedMediaClientProvider mockedMediaApi={mediaApi}>
				<MediaInlineCard
					identifier={identifier}
					mediaClientConfig={dummyMediaClientConfig}
					onClick={onClick}
				/>
			</MockedMediaClientProvider>,
		);
		const loadedView = await screen.findByTestId('media-inline-card-loaded-view');

		loadedView.click();

		expect(onClick).toHaveBeenCalledTimes(1);
		expect(onClick).toHaveBeenCalledWith(expect.objectContaining({ mediaItemDetails: identifier }));
	});

	it('should render right media file type icon', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingJpegWithRemotePreview();
		const { mediaApi } = createMockedMediaApi(fileItem);

		render(
			<MockedMediaClientProvider mockedMediaApi={mediaApi}>
				<MediaInlineCard identifier={identifier} mediaClientConfig={dummyMediaClientConfig} />
			</MockedMediaClientProvider>,
		);
		const fileTypeIcon = await screen.findByTestId('media-inline-card-file-type-icon');
		expect(fileTypeIcon.getAttribute('data-type')).toEqual('image');
		expect(fileTypeIcon).toBeTruthy();
	});

	describe('should render right icon when mimeType is more specific than media type', () => {
		it('for csv', async () => {
			const [fileItem, identifier] = generateSampleFileItem.csv();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<MediaInlineCard identifier={identifier} mediaClientConfig={dummyMediaClientConfig} />
				</MockedMediaClientProvider>,
			);
			const fileTypeIcon = await screen.findByTestId('media-inline-card-file-type-icon');
			expect(fileTypeIcon.getAttribute('data-type')).toEqual('source-code');
		});

		it('for spreadshet', async () => {
			const [fileItem, identifier] = generateSampleFileItem.spreadsheet();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<MediaInlineCard identifier={identifier} mediaClientConfig={dummyMediaClientConfig} />
				</MockedMediaClientProvider>,
			);
			const fileTypeIcon = await screen.findByTestId('media-inline-card-file-type-icon');
			expect(fileTypeIcon.getAttribute('data-type')).toEqual('excel-spreadsheet');
		});
	});

	it('should render error view', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingJpegWithRemotePreview();
		const { mediaApi } = createMockedMediaApi(fileItem);

		jest.spyOn(mediaApi, 'getItems').mockRejectedValue(new Error('some-error'));

		render(
			<MockedMediaClientProvider mockedMediaApi={mediaApi}>
				<MediaInlineCard identifier={identifier} mediaClientConfig={dummyMediaClientConfig} />
			</MockedMediaClientProvider>,
		);
		const erroredView = await screen.findByTestId('media-inline-card-errored-view');

		expect(erroredView).toBeTruthy();
	});

	ffTest.on('platform_media_cross_client_copy', 'Copy', () => {
		it('should call copy intent', async () => {
			const user = userEvent.setup();

			const [fileItem, identifier] = generateSampleFileItem.workingJpegWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			const registerCopyIntents = jest.spyOn(mediaApi, 'registerCopyIntents');

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<div>from here</div>
					<MediaInlineCard identifier={identifier} mediaClientConfig={dummyMediaClientConfig} />
					<div>to here</div>
				</MockedMediaClientProvider>,
			);

			await screen.findByTestId('media-inline-card-loaded-view');
			await screen.findByText(fileItem.details.name);

			await user.pointer({
				keys: '[MouseLeft][MouseLeft>]',
				target: screen.getByText('from here'),
				offset: 0,
			});

			await user.pointer({
				target: screen.getByText('to here'),
			});

			await user.copy();

			expect(registerCopyIntents).toHaveBeenCalledTimes(1);
			expect(registerCopyIntents).toHaveBeenCalledWith(
				[{ id: identifier.id, collection: identifier.collectionName }],
				{ spanId: expect.any(String), traceId: expect.any(String) },
				expect.any(Object),
			);
		});
	});

	describe('Analytics', () => {
		it('should send succeeded event once if file is processed and rendered', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingJpegWithRemotePreview();

			const { MockedMediaClientProvider, processItem } = createMockedMediaClientProvider({
				initialItems: fileItem,
			});

			// Sets the item to 'processing' status
			processItem(fileItem, 0);

			render(
				<MockedMediaClientProvider>
					<MediaInlineCard identifier={identifier} mediaClientConfig={dummyMediaClientConfig} />
				</MockedMediaClientProvider>,
			);
			expect(fireOperationalEvent).toHaveBeenCalledTimes(0);

			processItem(fileItem, 1);

			await screen.findByTestId('media-inline-card-loaded-view');
			await screen.findByText(fileItem.details.name);

			await waitFor(() => {
				expect(fireOperationalEvent).toBeCalledTimes(1);
			});

			const {
				id,
				details: { size, mediaType, mimeType },
			} = fileItem;

			expect(fireOperationalEvent).toBeCalledWith(
				{
					eventType: 'operational',
					action: 'succeeded',
					actionSubject: 'mediaInlineRender',
					attributes: {
						status: 'success',
						fileAttributes: {
							fileId: id,
							fileSize: size,
							fileMediatype: mediaType,
							fileMimetype: mimeType,
							fileStatus: 'processed',
						},
					},
				},
				expect.any(Function),
			);
		});

		it('should send failed event once if file processing is failed', async () => {
			const [fileItem, identifier] = generateSampleFileItem.failedVideo();
			const { MockedMediaClientProvider, processItem } = createMockedMediaClientProvider({
				initialItems: fileItem,
			});

			// Sets the item to 'processing' status
			processItem(fileItem, 0);

			render(
				<MockedMediaClientProvider>
					<MediaInlineCard identifier={identifier} mediaClientConfig={dummyMediaClientConfig} />
				</MockedMediaClientProvider>,
			);

			// Should display loaded card
			const loadedView = await screen.findByTestId('media-inline-card-loaded-view');
			const title = await screen.findByText(fileItem.details.name);
			expect(loadedView).toBeTruthy();
			expect(title).toBeTruthy();

			expect(fireOperationalEvent).toHaveBeenCalledTimes(0);

			processItem(fileItem, 1);

			await waitFor(
				() => {
					expect(fireOperationalEvent).toHaveBeenCalledTimes(1);
				},
				// Needs to wait for the polling function to kick next fetch
				{ timeout: 5000 },
			);

			expect(fireOperationalEvent).toBeCalledWith(
				{
					eventType: 'operational',
					action: 'failed',
					actionSubject: 'mediaInlineRender',
					attributes: {
						status: 'fail',
						fileAttributes: {
							fileId: fileItem.id,
							fileStatus: 'failed-processing',
						},
						failReason: 'failed-processing',
					},
				},
				expect.any(Function),
			);
		});

		it('should send failed event once if file subscription errored', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingJpegWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			jest.spyOn(mediaApi, 'getItems').mockRejectedValue(createServerUnauthorizedError());

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<MediaInlineCard identifier={identifier} mediaClientConfig={dummyMediaClientConfig} />
				</MockedMediaClientProvider>,
			);

			await waitFor(() => {
				expect(fireOperationalEvent).toHaveBeenCalledTimes(1);
			});

			expect(fireOperationalEvent).toHaveBeenCalledWith(
				{
					eventType: 'operational',
					action: 'failed',
					actionSubject: 'mediaInlineRender',
					attributes: {
						status: 'fail',
						fileAttributes: {
							fileId: fileItem.id,
							fileStatus: undefined,
						},
						error: 'serverUnauthorized',
						errorDetail: 'inner error message',
						failReason: 'metadata-fetch',
						metadataTraceContext: {
							spanId: 'some-span',
							traceId: 'some-trace',
						},
					},
				},
				expect.any(Function),
			);
		});

		// Unreachable case
		// Unskip and convert to createMockedMediaApi once the component has migrated to Media Client Hook
		/* it('should send failed event once if file state is error', async () => {
			render(
				<MockedMediaClientProvider mockedMediaApi={{}}>
					<MediaInlineCard intl={fakeIntl} identifier={identifier} mediaClient={mediaClient} />
				</MockedMediaClientProvider>,
			);
			expect(fireOperationalEvent).toBeCalledTimes(0);

			act(() =>
				observable.next({
					...mockFileState,
					status: 'error',
					message: 'serverForbidden',
				}),
			);

			await waitFor(() => {
				expect(fireOperationalEvent).toBeCalledTimes(1);
			});

			expect(fireOperationalEvent).toBeCalledWith(
				{
					eventType: 'operational',
					action: 'failed',
					actionSubject: 'mediaInlineRender',
					attributes: {
						status: 'fail',
						fileAttributes: {
							fileId: mockFileState.id,
							fileStatus: 'error',
						},
						error: 'nativeError',
						errorDetail: 'serverForbidden',
						failReason: 'error-file-state',
					},
				},
				expect.any(Function),
			);
		}); */

		it('should send failed event once if file state has no filename', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingJpegWithRemotePreview();
			// @ts-ignore
			delete fileItem.details.name;
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<MediaInlineCard identifier={identifier} mediaClientConfig={dummyMediaClientConfig} />
				</MockedMediaClientProvider>,
			);
			await screen.findByTestId('media-inline-card-errored-view');

			expect(fireOperationalEvent).toHaveBeenCalledTimes(1);
			expect(fireOperationalEvent).toHaveBeenCalledWith(
				{
					eventType: 'operational',
					action: 'failed',
					actionSubject: 'mediaInlineRender',
					attributes: {
						status: 'fail',
						fileAttributes: {
							fileId: fileItem.id,
							fileStatus: 'processed',
						},
						error: 'emptyFileName',
						errorDetail: 'emptyFileName',
						failReason: 'metadata-fetch',
					},
				},
				expect.any(Function),
			);
		});
	});
});
