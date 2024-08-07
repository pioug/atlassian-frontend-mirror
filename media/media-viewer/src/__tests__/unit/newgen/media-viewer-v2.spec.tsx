jest.mock('@atlaskit/media-client-react', () => {
	const actualModule = jest.requireActual('@atlaskit/media-client-react');
	return { __esModule: true, ...actualModule };
});
import React, { useState } from 'react';
import { type MediaClient, getFileStreamsCache } from '@atlaskit/media-client';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import EditorPanelIcon from '@atlaskit/icon/glyph/editor/panel';
import { MockedMediaClientProvider } from '@atlaskit/media-client-react/test-helpers';
import { createMockedMediaClientProvider } from './utils/mockedMediaClientProvider/_MockedMediaClientProvider';
import { useMediaClient } from '@atlaskit/media-client-react';
import { MediaViewerV2 } from '../../../v2/media-viewer-v2';
import { MediaViewer as MediaViewerV1 } from '../../../media-viewer';
import { type MediaViewerExtensions } from '../../../components/types';
import { createMockedMediaApi } from '@atlaskit/media-client/test-helpers';
import { generateSampleFileItem } from '@atlaskit/media-test-data';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import * as MediaClientProviderModule from '@atlaskit/media-client-react';
import * as analytics from '../../../analytics';
import * as ufoWrapper from '../../../analytics/ufoExperiences';

const fireAnalyticsMock = jest.spyOn(analytics, 'fireAnalytics');
const mocksucceedMediaFileUfoExperience = jest.spyOn(ufoWrapper, 'succeedMediaFileUfoExperience');
const mockfailMediaFileUfoExperience = jest.spyOn(ufoWrapper, 'failMediaFileUfoExperience');
const mockstartMediaFileUfoExperience = jest.spyOn(ufoWrapper, 'startMediaFileUfoExperience');

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('<MediaViewer />', () => {
	const user = userEvent.setup();
	const onEvent = jest.fn();

	beforeEach(() => {
		getFileStreamsCache().removeAll();
		jest.clearAllMocks();
	});

	afterEach(() => {
		onEvent.mockClear();
	});

	// We are keeping the test for this data-testid since JIRA is still using it in their codebase to perform checks. Before removing this test, we need to ensure this 'media-viewer-popup' test id is not being used anywhere else in other codebases
	// Related ticket https://product-fabric.atlassian.net/browse/MPT-15
	it('should attach data-testid to the blanket', () => {
		const [fileItem, identifier] = generateSampleFileItem.workingVideo();
		const { mediaApi } = createMockedMediaApi(fileItem);

		const { container } = render(
			<MockedMediaClientProvider mockedMediaApi={mediaApi}>
				<MediaViewerV2 selectedItem={identifier} items={[identifier]} />
			</MockedMediaClientProvider>,
		);

		// the query below should return a Blanket component, there is no other sure way to query the Blanket element at the moment rather than
		const blanketComponent = container.querySelector(
			'.media-viewer-popup[data-testid="media-viewer-popup"]',
		);
		expect(blanketComponent).toBeInTheDocument();
	});

	describe('Closing Media Viewer', () => {
		it("should trigger onClose function Media Viewer on 'Escape' key press", async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingVideo();
			const { mediaApi } = createMockedMediaApi(fileItem);

			const { unmount } = render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<MediaViewerV2 selectedItem={identifier} items={[]} onClose={() => unmountFunction()} />
				</MockedMediaClientProvider>,
			);
			const unmountFunction = unmount;

			// The presence of closeButton means that the mediaViewer opened
			const closeButton = screen.getByLabelText('Close');
			expect(closeButton).toBeInTheDocument();
			await user.keyboard('{Escape}');
			expect(closeButton).not.toBeInTheDocument();
		});

		it('should not trigger onClose function Media Viewer when clicking on other button on Header', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingVideo();
			const { mediaApi } = createMockedMediaApi(fileItem);

			const { unmount } = render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<MediaViewerV2 selectedItem={identifier} items={[]} onClose={() => unmountFunction()} />
				</MockedMediaClientProvider>,
			);
			const unmountFunction = unmount;

			const downloadButton = screen.getByRole('button', {
				name: /download/i,
			});

			// The presence of closeButton means that the mediaViewer opened
			const closeButton = screen.getByLabelText('Close');
			expect(closeButton).toBeInTheDocument();
			await user.click(downloadButton);
			expect(closeButton).toBeInTheDocument();
		});

		it('should trigger onClose function the Media Viewer when clicking on the Close button', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingVideo();
			const { mediaApi } = createMockedMediaApi(fileItem);

			const { unmount } = render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<MediaViewerV2
						selectedItem={identifier}
						items={[identifier]}
						onClose={() => unmountFunction()}
					/>
				</MockedMediaClientProvider>,
			);
			const unmountFunction = unmount;

			// The presence of closeButton means that the mediaViewer opened
			const closeButton = screen.getByLabelText('Close');
			expect(closeButton).toBeInTheDocument();
			await user.click(closeButton);
			expect(closeButton).not.toBeInTheDocument();
		});
	});

	describe('Analytics', () => {
		it('should trigger the screen event when the component loads', () => {
			const [fileItem, identifier] = generateSampleFileItem.workingVideo();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<AnalyticsListener channel="media" onEvent={onEvent}>
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<MediaViewerV2 selectedItem={identifier} items={[identifier]} />
					</MockedMediaClientProvider>
				</AnalyticsListener>,
			);
			expect(onEvent.mock.calls[0][0].payload).toEqual({
				action: 'viewed',
				actionSubject: 'mediaViewerModal',
				eventType: 'screen',
				name: 'mediaViewerModal',
			});
		});

		it('should send analytics when closed with button', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingVideo();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<AnalyticsListener channel="media" onEvent={onEvent}>
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<MediaViewerV2 selectedItem={identifier} items={[identifier]} />
					</MockedMediaClientProvider>
				</AnalyticsListener>,
			);

			const closeButton = screen.getByLabelText('Close');
			await user.click(closeButton);
			expect(onEvent).toHaveBeenCalled();
			// Here, we check if any event has been called with the attribute input = button, not just the last call.
			// This is because the onEvent call stack can get out of order sometimes due to React 18's batched updates
			expect(
				onEvent.mock.calls.some((call) => call[0].payload.attributes?.input === 'button'),
			).toBeTruthy();
		});

		// TODO: this test is flaky on pipeline, that's why its skipped for now and needs to be unskipped in the future

		/* it('should send analytics when closed with esc key', async () => {
      render(
        <AnalyticsListener channel="media" onEvent={onEvent}>
          <MockedMediaClientProvider
            mockedMediaApi={mediaApi}

          >
            <MediaViewerV2
              selectedItem={workingVideoIdentifier}
              items={[workingVideoIdentifier]}
            />
          </MockedMediaClientProvider>
        </AnalyticsListener>,
      );

      await user.keyboard('[Escape]');
      expect(onEvent).toHaveBeenCalled();
      const closeEvent: any =
        onEvent.mock.calls[onEvent.mock.calls.length - 1][0];
      expect(closeEvent.payload.attributes.input).toEqual('escKey');
    }); */
	});

	describe('Sidebar integration', () => {
		let sidebarExtension: MediaViewerExtensions;
		let mockSidebarRenderer: jest.Mock<any, any>;

		beforeEach(() => {
			mockSidebarRenderer = jest.fn().mockImplementation(() => <div>Sidebar Content</div>);

			sidebarExtension = {
				sidebar: {
					icon: <EditorPanelIcon label="sidebar" />,
					renderer: mockSidebarRenderer,
				},
			};
		});

		describe('renderer', () => {
			it('should render sidebar with default selected identifier if not set in state', async () => {
				const [fileItem1, identifier1] = generateSampleFileItem.workingVideo();
				const [fileItem2, identifier2] = generateSampleFileItem.workingGif();
				const { mediaApi } = createMockedMediaApi([fileItem1, fileItem2]);

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<MediaViewerV2
							selectedItem={identifier1}
							items={[identifier2]}
							extensions={sidebarExtension}
						/>
					</MockedMediaClientProvider>,
				);

				const sidebarButton = screen.getByLabelText('sidebar');
				await user.click(sidebarButton);
				expect(screen.queryByText('Sidebar Content')).toBeInTheDocument();
				expect(mockSidebarRenderer).toHaveBeenLastCalledWith(identifier1, {
					close: expect.any(Function),
				});
			});

			it('should render sidebar with selected identifier in state', async () => {
				const [fileItem1, identifier1] = generateSampleFileItem.workingVideo();
				const [fileItem2, identifier2] = generateSampleFileItem.workingGif();
				const { mediaApi } = createMockedMediaApi([fileItem1, fileItem2]);

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<MediaViewerV2
							selectedItem={identifier1}
							items={[identifier1, identifier2]}
							extensions={sidebarExtension}
						/>
					</MockedMediaClientProvider>,
				);

				const sidebarButton = screen.getByLabelText('sidebar');

				await user.click(sidebarButton);
				expect(screen.queryByText('Sidebar Content')).toBeInTheDocument();
				expect(mockSidebarRenderer).toHaveBeenLastCalledWith(identifier1, {
					close: expect.any(Function),
				});

				await user.keyboard('[ArrowRight]');
				expect(mockSidebarRenderer).toHaveBeenLastCalledWith(identifier2, {
					close: expect.any(Function),
				});

				await user.keyboard('[ArrowLeft]');
				expect(mockSidebarRenderer).toHaveBeenLastCalledWith(identifier1, {
					close: expect.any(Function),
				});
			});

			it("should not show sidebar if extensions is not defined or sidebar's renderer is not defined", async () => {
				const [fileItem1, identifier1] = generateSampleFileItem.workingVideo();
				const [fileItem2, identifier2] = generateSampleFileItem.workingGif();
				const { mediaApi } = createMockedMediaApi([fileItem1, fileItem2]);

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<MediaViewerV2 selectedItem={identifier1} items={[identifier1]} />
					</MockedMediaClientProvider>,
				);

				const sidebarButton = screen.queryByLabelText('sidebar');
				expect(sidebarButton).not.toBeInTheDocument();

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<MediaViewerV2
							selectedItem={identifier1}
							items={[identifier1, identifier2]}
							extensions={{}}
						/>
					</MockedMediaClientProvider>,
				);
				expect(sidebarButton).not.toBeInTheDocument();
			});
		});

		it('should toggle visibility of sidebar correctly', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingVideo();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<MediaViewerV2
						selectedItem={identifier}
						items={[identifier]}
						extensions={sidebarExtension}
					/>
				</MockedMediaClientProvider>,
			);
			const sidebarButton = screen.getByLabelText('sidebar');
			await user.click(sidebarButton);
			expect(screen.queryByText('Sidebar Content')).toBeInTheDocument();
			await user.click(sidebarButton);
			expect(screen.queryByText('Sidebar Content')).not.toBeInTheDocument();
		});
	});

	ffTest.on('platform.media-svg-rendering', 'SVG Native Rendering', () => {
		describe('Media Viewer v2', () => {
			it('should render SVG natively', async () => {
				const [fileItem, identifier] = generateSampleFileItem.svg();
				const { mediaApi } = createMockedMediaApi(fileItem);

				const { findByTestId } = render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<MediaViewerV2 selectedItem={identifier} items={[identifier]} />
					</MockedMediaClientProvider>,
				);

				const elem = await findByTestId('media-viewer-svg');
				expect(elem).toBeDefined();
				expect((elem as unknown as HTMLElement).nodeName.toLowerCase()).toBe('img');
				const imgElement = elem as unknown as HTMLImageElement;
				fireEvent.load(imgElement);

				const fileAttributes = {
					fileId: identifier.id,
					fileMediatype: fileItem.details.mediaType,
					fileMimetype: fileItem.details.mimeType,
					fileSize: fileItem.details.size,
				};

				expect(fireAnalyticsMock).toHaveBeenLastCalledWith(
					expect.objectContaining({
						action: 'loadSucceeded',
						actionSubject: 'mediaFile',
						attributes: {
							fileAttributes,
							fileMediatype: 'image',
							fileMimetype: fileAttributes.fileMimetype,
							status: 'success',
							traceContext: { traceId: expect.any(String) },
						},
						eventType: 'operational',
					}),
					expect.anything(),
				);

				expect(mockstartMediaFileUfoExperience).toBeCalledTimes(1);
				expect(mocksucceedMediaFileUfoExperience).toBeCalledWith(
					expect.objectContaining({
						fileAttributes,
						fileStateFlags: { wasStatusProcessing: false, wasStatusUploading: false },
					}),
				);
			});

			it('should render error screen when SVG binary fails to load', async () => {
				const [fileItem, identifier] = generateSampleFileItem.svg();
				const { mediaApi } = createMockedMediaApi(fileItem);

				// simulate error
				mediaApi.getFileBinary = () => {
					throw new Error('binary fetching error');
				};

				const { findByAltText } = render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<MediaViewerV2 selectedItem={identifier} items={[identifier]} />,
					</MockedMediaClientProvider>,
				);

				const errorIcon = await findByAltText(/error loading file/i);
				expect(errorIcon).toBeInTheDocument();

				expect(screen.getByText(/something went wrong\./i)).toBeInTheDocument();

				const fileAttributes = {
					fileId: identifier.id,
					fileMediatype: fileItem.details.mediaType,
					fileMimetype: fileItem.details.mimeType,
					fileSize: fileItem.details.size,
				};

				expect(fireAnalyticsMock).toHaveBeenLastCalledWith(
					expect.objectContaining({
						attributes: expect.objectContaining({
							failReason: 'svg-binary-fetch',
							fileMimetype: fileAttributes.fileMimetype,
							fileAttributes,
						}),
					}),
					expect.anything(),
				);

				expect(mockstartMediaFileUfoExperience).toBeCalledTimes(1);
				expect(mockfailMediaFileUfoExperience).toBeCalledWith(
					expect.objectContaining({
						error: 'nativeError',
						errorDetail: 'binary-fetch',
						failReason: 'svg-binary-fetch',
						fileAttributes,
						fileStateFlags: {
							wasStatusProcessing: false,
							wasStatusUploading: false,
						},
						request: undefined,
						traceContext: {
							traceId: expect.any(String),
						},
					}),
				);
			});

			it('should render error screen when image tag fails to render the file', async () => {
				const [fileItem, identifier] = generateSampleFileItem.svg();
				const { mediaApi } = createMockedMediaApi(fileItem);

				const { findByAltText, findByTestId } = render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<MediaViewerV2 selectedItem={identifier} items={[identifier]} />,
					</MockedMediaClientProvider>,
				);

				const elem = await findByTestId('media-viewer-svg');
				expect(elem).toBeDefined();
				expect((elem as unknown as HTMLElement).nodeName.toLowerCase()).toBe('img');
				const imgElement = elem as unknown as HTMLImageElement;
				fireEvent.error(imgElement);

				const errorIcon = await findByAltText(/error loading file/i);
				expect(errorIcon).toBeInTheDocument();

				expect(screen.getByText(/something went wrong\./i)).toBeInTheDocument();

				const fileAttributes = {
					fileId: identifier.id,
					fileMediatype: fileItem.details.mediaType,
					fileMimetype: fileItem.details.mimeType,
					fileSize: fileItem.details.size,
				};

				expect(fireAnalyticsMock).toHaveBeenLastCalledWith(
					expect.objectContaining({
						attributes: expect.objectContaining({
							failReason: 'svg-img-error',
							fileMimetype: fileAttributes.fileMimetype,
							fileAttributes,
						}),
					}),
					expect.anything(),
				);

				expect(mockstartMediaFileUfoExperience).toBeCalledTimes(1);
				expect(mockfailMediaFileUfoExperience).toBeCalledWith(
					expect.objectContaining({
						error: 'nativeError',
						errorDetail: 'img-error',
						failReason: 'svg-img-error',
						fileAttributes,
						fileStateFlags: {
							wasStatusProcessing: false,
							wasStatusUploading: false,
						},
						request: undefined,
						traceContext: {
							traceId: expect.any(String),
						},
					}),
				);
			});
		});

		describe('Media Viewer v1', () => {
			describe('should render SVG natively', () => {
				it('with a global MediaClientProvider', async () => {
					const [fileItem, identifier] = generateSampleFileItem.svg();
					const { MockedMediaClientProvider } = createMockedMediaClientProvider({
						initialItems: fileItem,
					});

					jest
						.spyOn(MediaClientProviderModule, 'MediaClientProvider')
						.mockImplementation(
							MockedMediaClientProvider as typeof MediaClientProviderModule.MediaClientProvider,
						);

					const ViewerV1Renderer = () => {
						const mediaClient = useMediaClient();
						return (
							<MediaViewerV1
								selectedItem={identifier}
								items={[identifier]}
								mediaClient={mediaClient}
							/>
						);
					};

					const { findByTestId } = render(
						<MockedMediaClientProvider>
							<ViewerV1Renderer />
						</MockedMediaClientProvider>,
					);

					const elem = await findByTestId('media-viewer-svg');
					expect(elem).toBeDefined();
					expect((elem as unknown as HTMLElement).nodeName.toLowerCase()).toBe('img');
					const imgElement = elem as unknown as HTMLImageElement;
					fireEvent.load(imgElement);

					const fileAttributes = {
						fileId: identifier.id,
						fileMediatype: fileItem.details.mediaType,
						fileMimetype: fileItem.details.mimeType,
						fileSize: fileItem.details.size,
					};

					expect(fireAnalyticsMock).toHaveBeenLastCalledWith(
						expect.objectContaining({
							action: 'loadSucceeded',
							actionSubject: 'mediaFile',
							attributes: {
								fileAttributes,
								fileMediatype: 'image',
								fileMimetype: fileAttributes.fileMimetype,
								status: 'success',
								traceContext: { traceId: expect.any(String) },
							},
							eventType: 'operational',
						}),
						expect.anything(),
					);

					expect(mockstartMediaFileUfoExperience).toBeCalledTimes(1);
					expect(mocksucceedMediaFileUfoExperience).toBeCalledWith(
						expect.objectContaining({
							fileAttributes,
							fileStateFlags: { wasStatusProcessing: false, wasStatusUploading: false },
						}),
					);
				});

				it('without a global MediaClientProvider', async () => {
					const [fileItem, identifier] = generateSampleFileItem.svg();
					const { MockedMediaClientProvider } = createMockedMediaClientProvider({
						initialItems: fileItem,
					});

					jest
						.spyOn(MediaClientProviderModule, 'MediaClientProvider')
						.mockImplementation(
							MockedMediaClientProvider as typeof MediaClientProviderModule.MediaClientProvider,
						);

					const ViewerV1Renderer = () => {
						const [mediaClient, setMediaClient] = useState<MediaClient>();
						return (
							<>
								<MockedMediaClientProvider>
									<MediaClientInjector onMediaClient={setMediaClient} />
								</MockedMediaClientProvider>
								{mediaClient && (
									<MediaViewerV1
										selectedItem={identifier}
										items={[identifier]}
										mediaClient={mediaClient}
									/>
								)}
							</>
						);
					};

					const MediaClientInjector = ({
						onMediaClient,
					}: {
						onMediaClient: (mediaClient: MediaClient) => void;
					}) => {
						const mediaClient = useMediaClient();
						onMediaClient(mediaClient);
						return null;
					};

					const { findByTestId } = render(<ViewerV1Renderer />);

					const elem = await findByTestId('media-viewer-svg');
					expect(elem).toBeDefined();
					expect((elem as unknown as HTMLElement).nodeName.toLowerCase()).toBe('img');
					const imgElement = elem as unknown as HTMLImageElement;
					fireEvent.load(imgElement);

					const fileAttributes = {
						fileId: identifier.id,
						fileMediatype: fileItem.details.mediaType,
						fileMimetype: fileItem.details.mimeType,
						fileSize: fileItem.details.size,
					};

					expect(fireAnalyticsMock).toHaveBeenLastCalledWith(
						expect.objectContaining({
							action: 'loadSucceeded',
							actionSubject: 'mediaFile',
							attributes: {
								fileAttributes,
								fileMediatype: 'image',
								fileMimetype: fileAttributes.fileMimetype,
								status: 'success',
								traceContext: { traceId: expect.any(String) },
							},
							eventType: 'operational',
						}),
						expect.anything(),
					);

					expect(mockstartMediaFileUfoExperience).toBeCalledTimes(1);
					expect(mocksucceedMediaFileUfoExperience).toBeCalledWith(
						expect.objectContaining({
							fileAttributes,
							fileStateFlags: { wasStatusProcessing: false, wasStatusUploading: false },
						}),
					);
				});
			});

			describe('should render error screen when SVG binary fails to load', () => {
				it('with a global MediaClientProvider', async () => {
					const [fileItem, identifier] = generateSampleFileItem.svg();
					const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
						initialItems: fileItem,
					});

					// simulate error
					mediaApi.getFileBinary = () => {
						throw new Error('binary fetching error');
					};

					jest
						.spyOn(MediaClientProviderModule, 'MediaClientProvider')
						.mockImplementation(
							MockedMediaClientProvider as typeof MediaClientProviderModule.MediaClientProvider,
						);

					const ViewerV1Renderer = () => {
						const mediaClient = useMediaClient();
						return (
							<MediaViewerV1
								selectedItem={identifier}
								items={[identifier]}
								mediaClient={mediaClient}
							/>
						);
					};

					const { findByAltText } = render(
						<MockedMediaClientProvider>
							<ViewerV1Renderer />
						</MockedMediaClientProvider>,
					);

					const errorIcon = await findByAltText(/error loading file/i);
					expect(errorIcon).toBeInTheDocument();

					expect(screen.getByText(/something went wrong\./i)).toBeInTheDocument();

					const fileAttributes = {
						fileId: identifier.id,
						fileMediatype: fileItem.details.mediaType,
						fileMimetype: fileItem.details.mimeType,
						fileSize: fileItem.details.size,
					};

					expect(fireAnalyticsMock).toHaveBeenLastCalledWith(
						expect.objectContaining({
							attributes: expect.objectContaining({
								failReason: 'svg-binary-fetch',
								fileMimetype: fileAttributes.fileMimetype,
								fileAttributes,
							}),
						}),
						expect.anything(),
					);

					expect(mockstartMediaFileUfoExperience).toBeCalledTimes(1);
					expect(mockfailMediaFileUfoExperience).toBeCalledWith(
						expect.objectContaining({
							error: 'nativeError',
							errorDetail: 'binary-fetch',
							failReason: 'svg-binary-fetch',
							fileAttributes,
							fileStateFlags: {
								wasStatusProcessing: false,
								wasStatusUploading: false,
							},
							request: undefined,
							traceContext: {
								traceId: expect.any(String),
							},
						}),
					);
				});

				it('without a global MediaClientProvider', async () => {
					const [fileItem, identifier] = generateSampleFileItem.svg();
					const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
						initialItems: fileItem,
					});

					// simulate error
					mediaApi.getFileBinary = () => {
						throw new Error('binary fetching error');
					};

					jest
						.spyOn(MediaClientProviderModule, 'MediaClientProvider')
						.mockImplementation(
							MockedMediaClientProvider as typeof MediaClientProviderModule.MediaClientProvider,
						);

					const MediaClientInjector = ({
						onMediaClient,
					}: {
						onMediaClient: (mediaClient: MediaClient) => void;
					}) => {
						const mediaClient = useMediaClient();
						onMediaClient(mediaClient);
						return null;
					};

					const ViewerV1Renderer = () => {
						const [mediaClient, setMediaClient] = useState<MediaClient>();
						return (
							<>
								<MockedMediaClientProvider>
									<MediaClientInjector onMediaClient={setMediaClient} />
								</MockedMediaClientProvider>
								{mediaClient && (
									<MediaViewerV1
										selectedItem={identifier}
										items={[identifier]}
										mediaClient={mediaClient}
									/>
								)}
							</>
						);
					};

					const { findByAltText } = render(<ViewerV1Renderer />);

					const errorIcon = await findByAltText(/error loading file/i);
					expect(errorIcon).toBeInTheDocument();

					expect(screen.getByText(/something went wrong\./i)).toBeInTheDocument();

					const fileAttributes = {
						fileId: identifier.id,
						fileMediatype: fileItem.details.mediaType,
						fileMimetype: fileItem.details.mimeType,
						fileSize: fileItem.details.size,
					};

					expect(fireAnalyticsMock).toHaveBeenLastCalledWith(
						expect.objectContaining({
							attributes: expect.objectContaining({
								failReason: 'svg-binary-fetch',
								fileMimetype: fileAttributes.fileMimetype,
								fileAttributes,
							}),
						}),
						expect.anything(),
					);

					expect(mockstartMediaFileUfoExperience).toBeCalledTimes(1);
					expect(mockfailMediaFileUfoExperience).toBeCalledWith(
						expect.objectContaining({
							error: 'nativeError',
							errorDetail: 'binary-fetch',
							failReason: 'svg-binary-fetch',
							fileAttributes,
							fileStateFlags: {
								wasStatusProcessing: false,
								wasStatusUploading: false,
							},
							request: undefined,
							traceContext: {
								traceId: expect.any(String),
							},
						}),
					);
				});
			});

			describe('should render error screen when image tag fails to render the file', () => {
				it('with a global MediaClientProvider', async () => {
					const [fileItem, identifier] = generateSampleFileItem.svg();
					const { MockedMediaClientProvider } = createMockedMediaClientProvider({
						initialItems: fileItem,
					});

					jest
						.spyOn(MediaClientProviderModule, 'MediaClientProvider')
						.mockImplementation(
							MockedMediaClientProvider as typeof MediaClientProviderModule.MediaClientProvider,
						);

					const ViewerV1Renderer = () => {
						const mediaClient = useMediaClient();
						return (
							<MediaViewerV1
								selectedItem={identifier}
								items={[identifier]}
								mediaClient={mediaClient}
							/>
						);
					};

					const { findByAltText, findByTestId } = render(
						<MockedMediaClientProvider>
							<ViewerV1Renderer />
						</MockedMediaClientProvider>,
					);

					const elem = await findByTestId('media-viewer-svg');
					expect(elem).toBeDefined();
					expect((elem as unknown as HTMLElement).nodeName.toLowerCase()).toBe('img');
					const imgElement = elem as unknown as HTMLImageElement;
					fireEvent.error(imgElement);

					const errorIcon = await findByAltText(/error loading file/i);
					expect(errorIcon).toBeInTheDocument();

					expect(screen.getByText(/something went wrong\./i)).toBeInTheDocument();

					const fileAttributes = {
						fileId: identifier.id,
						fileMediatype: fileItem.details.mediaType,
						fileMimetype: fileItem.details.mimeType,
						fileSize: fileItem.details.size,
					};

					expect(fireAnalyticsMock).toHaveBeenLastCalledWith(
						expect.objectContaining({
							attributes: expect.objectContaining({
								failReason: 'svg-img-error',
								fileMimetype: fileAttributes.fileMimetype,
								fileAttributes,
							}),
						}),
						expect.anything(),
					);

					expect(mockstartMediaFileUfoExperience).toBeCalledTimes(1);
					expect(mockfailMediaFileUfoExperience).toBeCalledWith(
						expect.objectContaining({
							error: 'nativeError',
							errorDetail: 'img-error',
							failReason: 'svg-img-error',
							fileAttributes,
							fileStateFlags: {
								wasStatusProcessing: false,
								wasStatusUploading: false,
							},
							request: undefined,
							traceContext: {
								traceId: expect.any(String),
							},
						}),
					);
				});

				it('without a global MediaClientProvider', async () => {
					const [fileItem, identifier] = generateSampleFileItem.svg();
					const { MockedMediaClientProvider } = createMockedMediaClientProvider({
						initialItems: fileItem,
					});

					jest
						.spyOn(MediaClientProviderModule, 'MediaClientProvider')
						.mockImplementation(
							MockedMediaClientProvider as typeof MediaClientProviderModule.MediaClientProvider,
						);

					const MediaClientInjector = ({
						onMediaClient,
					}: {
						onMediaClient: (mediaClient: MediaClient) => void;
					}) => {
						const mediaClient = useMediaClient();
						onMediaClient(mediaClient);
						return null;
					};

					const ViewerV1Renderer = () => {
						const [mediaClient, setMediaClient] = useState<MediaClient>();
						return (
							<>
								<MockedMediaClientProvider>
									<MediaClientInjector onMediaClient={setMediaClient} />
								</MockedMediaClientProvider>
								{mediaClient && (
									<MediaViewerV1
										selectedItem={identifier}
										items={[identifier]}
										mediaClient={mediaClient}
									/>
								)}
							</>
						);
					};

					const { findByAltText, findByTestId } = render(<ViewerV1Renderer />);

					const elem = await findByTestId('media-viewer-svg');
					expect(elem).toBeDefined();
					expect((elem as unknown as HTMLElement).nodeName.toLowerCase()).toBe('img');
					const imgElement = elem as unknown as HTMLImageElement;
					fireEvent.error(imgElement);

					const errorIcon = await findByAltText(/error loading file/i);
					expect(errorIcon).toBeInTheDocument();

					expect(screen.getByText(/something went wrong\./i)).toBeInTheDocument();

					const fileAttributes = {
						fileId: identifier.id,
						fileMediatype: fileItem.details.mediaType,
						fileMimetype: fileItem.details.mimeType,
						fileSize: fileItem.details.size,
					};

					expect(fireAnalyticsMock).toHaveBeenLastCalledWith(
						expect.objectContaining({
							attributes: expect.objectContaining({
								failReason: 'svg-img-error',
								fileMimetype: fileAttributes.fileMimetype,
								fileAttributes,
							}),
						}),
						expect.anything(),
					);

					expect(mockstartMediaFileUfoExperience).toBeCalledTimes(1);
					expect(mockfailMediaFileUfoExperience).toBeCalledWith(
						expect.objectContaining({
							error: 'nativeError',
							errorDetail: 'img-error',
							failReason: 'svg-img-error',
							fileAttributes,
							fileStateFlags: {
								wasStatusProcessing: false,
								wasStatusUploading: false,
							},
							request: undefined,
							traceContext: {
								traceId: expect.any(String),
							},
						}),
					);
				});
			});
		});
	});
});
