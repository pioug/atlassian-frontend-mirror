import React from 'react';
import { getFileStreamsCache } from '@atlaskit/media-client';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import EditorPanelIcon from '@atlaskit/icon/glyph/editor/panel';
import { MockedMediaClientProvider } from '@atlaskit/media-client-react/test-helpers';
import { MediaViewerV2 } from '../../../v2/media-viewer-v2';
import { type MediaViewerExtensions } from '../../../components/types';
import { createMockedMediaApi } from '@atlaskit/media-client/test-helpers';
import { generateSampleFileItem } from '@atlaskit/media-test-data';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('<MediaViewer />', () => {
	const user = userEvent.setup();
	const onEvent = jest.fn();

	afterEach(() => {
		getFileStreamsCache().removeAll();
		jest.restoreAllMocks();
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
			const closeEvent: any = onEvent.mock.calls[onEvent.mock.calls.length - 1][0];
			expect(closeEvent.payload.attributes.input).toEqual('button');
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

	describe('SVG', () => {
		describe('should render SVG natively', () => {
			ffTest(
				'platform.media-svg-rendering',
				async () => {
					const [fileItem, identifier] = generateSampleFileItem.svg();
					const { mediaApi } = createMockedMediaApi(fileItem);

					const { findAllByTestId } = render(
						<MockedMediaClientProvider mockedMediaApi={mediaApi}>
							<MediaViewerV2 selectedItem={identifier} items={[identifier]} />
						</MockedMediaClientProvider>,
					);

					const elem = await findAllByTestId('media-viewer-svg');
					expect(elem).toBeDefined();
					expect(elem[0].nodeName.toLowerCase()).toBe('img');
				},
				async () => {
					const [fileItem, identifier] = generateSampleFileItem.svg();
					const { mediaApi } = createMockedMediaApi(fileItem);

					const { findAllByTestId } = render(
						<MockedMediaClientProvider mockedMediaApi={mediaApi}>
							<MediaViewerV2 selectedItem={identifier} items={[identifier]} />
						</MockedMediaClientProvider>,
					);

					const elem = await findAllByTestId('media-viewer-image');
					expect(elem).toBeDefined();
					expect(elem[0].nodeName.toLowerCase()).toBe('img');
				},
			);
		});
	});
});
