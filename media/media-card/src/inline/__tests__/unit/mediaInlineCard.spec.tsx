import React from 'react';
import { MediaInlineCardInternal as MediaInlineCard } from '../../mediaInlineCard';
import {
	type FileIdentifier,
	type FileState,
	createMediaSubject,
	type ErrorFileState,
	fromObservable,
} from '@atlaskit/media-client';
import { fakeMediaClient, fakeIntl, asMock } from '@atlaskit/media-test-helpers';
import { act, render, screen, waitFor } from '@testing-library/react';
import * as analyticsModule from '../../../utils/analytics/analytics';
import { MockedMediaClientProvider } from '@atlaskit/media-client-react/test-helpers';
import userEvent from '@testing-library/user-event';
import { ffTest } from '@atlassian/feature-flags-test-utils';

describe('<MediaInlineCard />', () => {
	const identifier: FileIdentifier = {
		id: '1234',
		mediaItemType: 'file',
	};
	const mediaClient = fakeMediaClient();
	const mockFileState: FileState = {
		status: 'processing',
		id: '1234',
		name: 'file_name',
		size: 1024,
		mediaType: 'image',
		mimeType: 'image/png',
	};
	let observable = createMediaSubject();
	const fireOperationalEvent = jest.spyOn(analyticsModule, 'fireMediaCardEvent');

	beforeEach(() => {
		jest.clearAllMocks();
		observable = createMediaSubject();
		asMock(mediaClient.file.getFileState).mockReturnValue(fromObservable(observable));
		observable.next(mockFileState);
	});

	it('should render loading view while loading media file', async () => {
		render(
			<MockedMediaClientProvider mockedMediaApi={{}}>
				<MediaInlineCard intl={fakeIntl} identifier={identifier} mediaClient={fakeMediaClient()} />,
			</MockedMediaClientProvider>,
		);
		const element = await screen.findByTestId('media-inline-card-loading-view');
		expect(element).toBeTruthy();
	});

	it('should render loaded view when media loads successfully', async () => {
		render(
			<MockedMediaClientProvider mockedMediaApi={{}}>
				<MediaInlineCard intl={fakeIntl} identifier={identifier} mediaClient={mediaClient} />
			</MockedMediaClientProvider>,
		);
		const loadedView = await screen.findByTestId('media-inline-card-loaded-view');
		const title = await screen.findByText('file_name');

		expect(loadedView).toBeTruthy();
		expect(title).toBeTruthy();
	});

	it('should render MediaViewer when shouldOpenMediaViewer=true and clicked', async () => {
		render(
			<MockedMediaClientProvider mockedMediaApi={{}}>
				<MediaInlineCard
					intl={fakeIntl}
					identifier={identifier}
					mediaClient={mediaClient}
					shouldOpenMediaViewer
				/>
			</MockedMediaClientProvider>,
		);
		const loadedView = await screen.findByTestId('media-inline-card-loaded-view');

		loadedView.click();

		const mediaViewer = await screen.findByTestId('media-viewer-popup');

		expect(mediaViewer).toBeTruthy();
	});

	it('should call onClick callback when provided', async () => {
		const onClick = jest.fn();
		render(
			<MockedMediaClientProvider mockedMediaApi={{}}>
				<MediaInlineCard
					intl={fakeIntl}
					identifier={identifier}
					mediaClient={mediaClient}
					onClick={onClick}
				/>
			</MockedMediaClientProvider>,
		);
		const loadedView = await screen.findByTestId('media-inline-card-loaded-view');

		loadedView.click();

		expect(onClick).toBeCalledTimes(1);
		expect(onClick).toBeCalledWith(expect.objectContaining({ mediaItemDetails: identifier }));
	});

	it('should render right media file type icon', async () => {
		render(
			<MockedMediaClientProvider mockedMediaApi={{}}>
				<MediaInlineCard intl={fakeIntl} identifier={identifier} mediaClient={mediaClient} />
			</MockedMediaClientProvider>,
		);
		const fileTypeIcon = await screen.findByTestId('media-inline-card-file-type-icon');
		expect(fileTypeIcon.getAttribute('data-type')).toEqual('image');
		expect(fileTypeIcon).toBeTruthy();
	});

	it('should render right icon when mimeType is more specific than media type', async () => {
		const mockFileState: FileState = {
			status: 'processing',
			id: '1234',
			name: 'file_name',
			size: 1024,
			mediaType: 'doc',
			mimeType: 'text/csv',
		};

		asMock(mediaClient.file.getFileState).mockReturnValue(createMediaSubject(mockFileState));

		render(
			<MockedMediaClientProvider mockedMediaApi={{}}>
				<MediaInlineCard intl={fakeIntl} identifier={identifier} mediaClient={mediaClient} />
			</MockedMediaClientProvider>,
		);
		const fileTypeIcon = await screen.findByTestId('media-inline-card-file-type-icon');
		expect(fileTypeIcon.getAttribute('data-type')).toEqual('spreadsheet');
	});

	it('should render error view', async () => {
		asMock(mediaClient.file.getFileState).mockReturnValueOnce(
			createMediaSubject({ status: 'error' } as ErrorFileState),
		);
		render(
			<MockedMediaClientProvider mockedMediaApi={{}}>
				<MediaInlineCard intl={fakeIntl} identifier={identifier} mediaClient={mediaClient} />
			</MockedMediaClientProvider>,
		);
		const erroredView = await screen.findByTestId('media-inline-card-errored-view');

		expect(erroredView).toBeTruthy();
	});

	ffTest.on('platform_media_cross_client_copy', 'Copy', () => {
		it('should call copy intent', async () => {
			const user = userEvent.setup();

			const registerCopyIntents = jest.fn(async () => {});
			const resolveAuth = async () => ({
				token: 'some-token',
				clientId: 'some-client',
				baseUrl: 'some-url',
			});

			render(
				<MockedMediaClientProvider mockedMediaApi={{ registerCopyIntents, resolveAuth }}>
					<div>from here</div>
					<MediaInlineCard intl={fakeIntl} identifier={identifier} mediaClient={mediaClient} />
					<div>to here</div>
				</MockedMediaClientProvider>,
			);

			await screen.findByTestId('media-inline-card-loaded-view');
			await screen.findByText('file_name');

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
			render(
				<MockedMediaClientProvider mockedMediaApi={{}}>
					<MediaInlineCard intl={fakeIntl} identifier={identifier} mediaClient={mediaClient} />
				</MockedMediaClientProvider>,
			);
			expect(fireOperationalEvent).toBeCalledTimes(0);

			await screen.findByTestId('media-inline-card-loaded-view');
			await screen.findByText('file_name');
			act(() => {
				observable.next({ ...mockFileState, status: 'processed', artifacts: {} });
			});

			await waitFor(() => {
				expect(fireOperationalEvent).toBeCalledTimes(1);
			});

			expect(fireOperationalEvent).toBeCalledWith(
				{
					eventType: 'operational',
					action: 'succeeded',
					actionSubject: 'mediaInlineRender',
					attributes: {
						status: 'success',
						fileAttributes: {
							fileId: mockFileState.id,
							fileSize: mockFileState.size,
							fileMediatype: mockFileState.mediaType,
							fileMimetype: mockFileState.mimeType,
							fileStatus: 'processed',
						},
					},
				},
				expect.any(Function),
			);
		});

		it('should send failed event once if file processing is failed', async () => {
			render(
				<MockedMediaClientProvider mockedMediaApi={{}}>
					<MediaInlineCard intl={fakeIntl} identifier={identifier} mediaClient={mediaClient} />
				</MockedMediaClientProvider>,
			);

			// Should display loaded card
			const loadedView = await screen.findByTestId('media-inline-card-loaded-view');
			const title = await screen.findByText('file_name');
			expect(loadedView).toBeTruthy();
			expect(title).toBeTruthy();

			expect(fireOperationalEvent).toBeCalledTimes(0);

			act(() => {
				observable.next({
					...mockFileState,
					status: 'failed-processing',
					artifacts: {},
				});
			});

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
							fileStatus: 'failed-processing',
						},
						failReason: 'failed-processing',
					},
				},
				expect.any(Function),
			);
		});

		it('should send failed event once if file subscription errored', async () => {
			render(
				<MockedMediaClientProvider mockedMediaApi={{}}>
					<MediaInlineCard intl={fakeIntl} identifier={identifier} mediaClient={mediaClient} />
				</MockedMediaClientProvider>,
			);
			expect(fireOperationalEvent).toBeCalledTimes(0);
			observable.error(new Error('test'));

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
							fileStatus: 'processing',
						},
						error: 'nativeError',
						errorDetail: 'test',
						failReason: 'metadata-fetch',
					},
				},
				expect.any(Function),
			);
		});

		it('should send failed event once if file state is error', async () => {
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
		});

		it('should send failed event once if file state has no filename', async () => {
			render(
				<MockedMediaClientProvider mockedMediaApi={{}}>
					<MediaInlineCard intl={fakeIntl} identifier={identifier} mediaClient={mediaClient} />
				</MockedMediaClientProvider>,
			);
			await screen.findByTestId('media-inline-card-loaded-view');
			await screen.findByText('file_name');
			expect(fireOperationalEvent).toBeCalledTimes(0);

			act(() => {
				observable.next({
					status: 'processing',
					id: '1234',
				} as any);
			});
			expect(fireOperationalEvent).toBeCalledTimes(1);
			expect(fireOperationalEvent).toBeCalledWith(
				{
					eventType: 'operational',
					action: 'failed',
					actionSubject: 'mediaInlineRender',
					attributes: {
						status: 'fail',
						fileAttributes: {
							fileId: mockFileState.id,
							fileStatus: 'processing',
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
