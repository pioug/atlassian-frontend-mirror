jest.mock('../../utils/getElementDimension');
jest.mock('../../card/ui/styles', () => {
	const original = jest.requireActual('../../card/ui/styles');
	return {
		...original,
		calcBreakpointSize: jest.fn(original.calcBreakpointSize),
	};
});

import React from 'react';
import { CardView, CardViewBase, type CardViewProps } from '../../card/cardView';
import { type CardStatus } from '../../types';
import { type FileDetails } from '@atlaskit/media-client';
import { getDefaultCardDimensions } from '../../utils/cardDimensions';
import { getElementDimension } from '../../utils/getElementDimension';
import { createPollingMaxAttemptsError } from '@atlaskit/media-test-helpers';
import { imgTestId, spinnerTestId, cardTestId, cardBlanketTestId } from '../utils/_testIDs';
import { MediaCardError } from '../../errors';
import { AnalyticsListener, type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { FabricChannel } from '@atlaskit/analytics-listeners';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';
import DownloadIcon from '@atlaskit/icon/glyph/download';

const cardPreview = {
	dataURI: 'some-data',
	orientation: 6,
	source: 'remote',
} as const;

const containerWidth = 150;
(getElementDimension as jest.Mock).mockReturnValue(containerWidth);

const errorStatuses: Array<CardStatus> = ['failed-processing', 'error'];

const nonErrorOrLoadingStatuses: Array<CardStatus> = ['uploading', 'processing', 'complete'];

const nonErrorStatuses: Array<CardStatus> = [
	...nonErrorOrLoadingStatuses,
	'loading-preview',
	'loading',
];

const nonLoadingStatuses: Array<CardStatus> = [...nonErrorOrLoadingStatuses, ...errorStatuses];

const previewUnavailableMessage = 'Preview Unavailable';

const renderCardViewBase = (props: Partial<CardViewProps> = {}, renderOptions = {}) =>
	render(
		<IntlProvider
			locale="en"
			messages={{
				'fabric.media.preview_unavailable': previewUnavailableMessage,
			}}
		>
			<CardViewBase
				status="loading"
				mediaItemType="file"
				dimensions={{ width: 100, height: 100 }}
				{...props}
			/>
		</IntlProvider>,
		renderOptions,
	);

const file: FileDetails = {
	id: 'abcd',
	name: 'my-file',
	mimeType: 'image/png',
	size: 42,
	processingStatus: 'pending',
	mediaType: 'image',
};

describe('CardView', () => {
	it('should return analytics event as a last argument when card is clicked', async () => {
		const user = userEvent.setup();
		const clickHandler = jest.fn();
		const analyticsEventHandler = jest.fn();
		const { getByTestId } = render(
			<AnalyticsListener channel={FabricChannel.media} onEvent={analyticsEventHandler}>
				<CardView
					status="loading"
					mediaItemType="file"
					metadata={file}
					onClick={clickHandler}
					dimensions={{ width: 100, height: 100 }}
				/>
			</AnalyticsListener>,
		);

		await user.click(getByTestId(cardTestId));

		expect(clickHandler).toHaveBeenCalledTimes(1);
		expect(analyticsEventHandler).toHaveBeenCalledTimes(1);
		const actualFiredEvent: Partial<UIAnalyticsEvent> = analyticsEventHandler.mock.calls[0][0];
		const actualReturnedEvent: UIAnalyticsEvent = clickHandler.mock.calls[0][1];
		expect(actualFiredEvent.hasFired).toEqual(true);
		expect(actualFiredEvent.payload).toMatchObject({
			eventType: 'ui',
			action: 'clicked',
			actionSubject: 'mediaCard',
			attributes: {},
		});
		expect(actualReturnedEvent.hasFired).toEqual(false);
		expect(actualReturnedEvent.payload.action).toEqual('clicked');
		expect(actualReturnedEvent.context).toEqual(actualFiredEvent.context);
	});

	it('should trigger "media-viewed" in globalMediaEventEmitter when image card is rendered', () => {
		const onDisplayImage = jest.fn();
		render(
			<CardView
				status="complete"
				mediaItemType="file"
				cardPreview={cardPreview}
				metadata={file}
				resizeMode="stretchy-fit"
				onDisplayImage={onDisplayImage}
				dimensions={{ width: 100, height: 100 }}
			/>,
		);
		expect(onDisplayImage).toHaveBeenCalledTimes(1);
	});

	it(`should render media successfully`, async () => {
		const width = 100;
		const metadata: FileDetails = {
			id: 'some-id',
			mediaType: 'image',
		};
		const cardProps: CardViewProps = {
			testId: 'some-test-id',
			cardPreview,
			status: 'complete',
			mediaItemType: 'file',
			progress: 0.5,
			selected: true,
			metadata,
			alt: 'some-image',
			resizeMode: 'crop',
			dimensions: { width, height: 100 },
		};

		renderCardViewBase(cardProps);
		expect(screen.getByRole('img')).toBeInTheDocument();
	});

	describe('On Image Load/Error', () => {
		it.each(nonErrorStatuses)(
			'should not render image when it is not loaded and status is %s',
			(status) => {
				renderCardViewBase({
					status,
					cardPreview,
				});
				const mediaImage = screen.queryByTestId(imgTestId);
				expect(mediaImage).not.toBeVisible();
			},
		);

		it.each(nonErrorStatuses)(
			'should render image when it is loaded and status is %s',
			(status) => {
				renderCardViewBase({
					status,
					cardPreview,
				});
				const mediaImage = screen.getByTestId(imgTestId);
				fireEvent.load(mediaImage, cardPreview);
				expect(mediaImage).toBeVisible();
			},
		);

		it.each(nonErrorStatuses)(
			'should not render image when it is failed to render and status is %s',
			(status) => {
				renderCardViewBase({
					status,
					cardPreview,
				});
				const mediaImage = screen.getByTestId(imgTestId);
				fireEvent.error(mediaImage);
				expect(mediaImage).not.toBeVisible();
			},
		);

		it.each(nonErrorStatuses)(
			'should not render image when there is no cardPreview and when status is %s',
			(status) => {
				renderCardViewBase({
					status,
				});
				const mediaImage = screen.queryByTestId(imgTestId);
				expect(mediaImage).toBeNull();
			},
		);
	});

	describe('Dimensions and Breakpoint', () => {
		const defaultCardDimensionsWidth = parseInt(`${getDefaultCardDimensions().width}`, 10);

		[100, 135, containerWidth, defaultCardDimensionsWidth].forEach((width) => {
			it(`should pass the correct breakpoint to the Wrapper when dimension width is ${width}`, () => {
				render(<CardViewBase status="complete" mediaItemType="file" dimensions={{ width }} />);
				const mediaCard = screen.getByTestId(cardTestId);
				expect(window.getComputedStyle(mediaCard).width).toBe(`${width}px`);
			});
		});
	});
	describe('Render Layers', () => {
		describe('Spinner', () => {
			['loading', 'loading-preview'].forEach((status) => {
				it(`should render Spinner when status is ${status}`, () => {
					const { rerender } = render(
						<IntlProvider locale="en">
							<CardViewBase
								status="loading"
								mediaItemType="file"
								dimensions={{ width: 100, height: 100 }}
							/>
						</IntlProvider>,
					);

					expect(screen.queryByTestId(spinnerTestId)).toBeInTheDocument();

					rerender(
						<IntlProvider locale="en">
							<CardViewBase
								status="loading"
								mediaItemType="file"
								cardPreview={cardPreview}
								dimensions={{ width: 100, height: 100 }}
							/>
						</IntlProvider>,
					);
					expect(screen.queryByTestId(spinnerTestId)).toBeInTheDocument();
				});
			});

			it(`should not render Spinner when status is loading and image succeeded rendering`, () => {
				renderCardViewBase({
					status: 'loading',
					cardPreview,
				});
				const mediaImage = screen.getByTestId(imgTestId);
				fireEvent.load(mediaImage, cardPreview);
				expect(mediaImage).toBeVisible();
				expect(screen.queryByTestId(spinnerTestId)).toBeNull();
			});

			it.each(nonLoadingStatuses)(
				`should not render Spinner when status is %s`,
				(status: CardStatus) => {
					renderCardViewBase({ status });
					expect(screen.queryByTestId(spinnerTestId)).toBeNull();
				},
			);
		});

		describe('PlayButton', () => {
			it(`should render PlayButton when dataURI is defined`, () => {
				renderCardViewBase({
					metadata: { id: 'some-id', mediaType: 'video' },
					status: 'complete',
					cardPreview,
				});

				expect(screen.queryByLabelText('play')).toBeInTheDocument();
			});
			it(`should not render PlayButton when mediaType is not video`, () => {
				renderCardViewBase({
					metadata: { id: 'some-id', mediaType: 'image' },
					status: 'complete',
					cardPreview,
				});

				expect(screen.queryByLabelText('play')).not.toBeInTheDocument();
			});
		});

		describe('MediaTypeIcon', () => {
			it(`should not render when the status is loading`, () => {
				const metadata: FileDetails = { id: 'some-id', mediaType: 'video' };
				renderCardViewBase({
					metadata,
				});
				expect(screen.queryByLabelText('media-type')).not.toBeInTheDocument();
			});

			it.each(nonLoadingStatuses)(`should render when the status is %s`, (status) => {
				const metadata: FileDetails = { id: 'some-id', mediaType: 'video' };
				renderCardViewBase({
					metadata,
					cardPreview,
					status,
				});
				expect(screen.queryByLabelText('media-type')).toBeInTheDocument();
			});

			it.each(errorStatuses)(
				`should render when the status is %s and image succeeded rendering`,
				(status) => {
					const metadata: FileDetails = { id: 'some-id', mediaType: 'video' };
					renderCardViewBase({
						metadata,
						cardPreview,
						status,
					});
					expect(screen.queryByLabelText('media-type')).toBeInTheDocument();
				},
			);

			it.each(nonErrorOrLoadingStatuses)(
				`should not render when the status is %s and image succeeded rendering`,
				(status) => {
					const metadata: FileDetails = { id: 'some-id', mediaType: 'video' };
					renderCardViewBase({
						metadata,
						cardPreview,
						status,
					});
					const mediaImage = screen.getByTestId(imgTestId);
					fireEvent.load(mediaImage, cardPreview);
					expect(mediaImage).toBeVisible();
					expect(screen.queryByLabelText('media-type')).not.toBeInTheDocument();
				},
			);
		});

		it(`should render Blanket when overlay is enabled or status is uploading (except for video)`, () => {
			// Hoverable blanket
			// Component A
			const { rerender } = render(
				<IntlProvider locale="en">
					<CardViewBase
						status="loading"
						mediaItemType="file"
						dimensions={{ width: 100, height: 100 }}
					/>
				</IntlProvider>,
			);

			expect(screen.queryByTestId(cardBlanketTestId)).toBeInTheDocument();

			// Component B
			rerender(
				<IntlProvider locale="en">
					<CardViewBase
						status="uploading"
						mediaItemType="file"
						disableOverlay={true}
						metadata={{ id: 'some-id', mediaType: 'image' }}
						dimensions={{ width: 100, height: 100 }}
					/>
				</IntlProvider>,
			);

			expect(screen.queryByTestId(cardBlanketTestId)).toBeInTheDocument();

			// Component C
			rerender(
				<IntlProvider locale="en">
					<CardViewBase
						status="uploading"
						mediaItemType="file"
						disableOverlay={true}
						metadata={{ id: 'some-id', mediaType: 'video' }}
						dimensions={{ width: 100, height: 100 }}
					/>
				</IntlProvider>,
			);

			expect(screen.queryByTestId(cardBlanketTestId)).not.toBeInTheDocument();
		});

		it(`should render TitleBox when has filename and overlay is enabled`, () => {
			// Due to truncate logic in packages/media/media-ui/src/truncateText.tsx, it is best to keep metadata name to under 4 characters for testing
			const metadata = {
				id: 'some-id',
				name: 'some',
				createdAt: 123456,
			};

			// with metadata
			const { rerender } = render(
				<IntlProvider locale="en">
					<CardViewBase
						status="loading"
						mediaItemType="file"
						metadata={metadata}
						dimensions={{ width: 100, height: 100 }}
					/>
				</IntlProvider>,
			);

			expect(screen.queryByText('some')).toBeInTheDocument();
			// uploading and disabled overlay, no metadata
			rerender(
				<IntlProvider locale="en">
					<CardViewBase
						status="uploading"
						mediaItemType="file"
						disableOverlay={true}
						dimensions={{ width: 100, height: 100 }}
					/>
				</IntlProvider>,
			);

			expect(screen.queryByText('some')).not.toBeInTheDocument();

			// diabled overlay with metadata
			rerender(
				<IntlProvider locale="en">
					<CardViewBase
						status="loading"
						metadata={metadata}
						mediaItemType="file"
						disableOverlay={true}
						dimensions={{ width: 100, height: 100 }}
					/>
				</IntlProvider>,
			);

			expect(screen.queryByText('some')).not.toBeInTheDocument();

			// enabled overlay with no metadata
			rerender(
				<IntlProvider locale="en">
					<CardViewBase
						status="loading"
						mediaItemType="file"
						dimensions={{ width: 100, height: 100 }}
					/>
				</IntlProvider>,
			);

			expect(screen.queryByText('some')).not.toBeInTheDocument();
		});

		describe('FailedTitleBox', () => {
			it(`should not render when there is an error state or dataURI fails to load`, () => {
				const metadata: FileDetails = {
					id: 'some-id',
					name: 'some-file-name',
					createdAt: 123456,
				};

				// No dataURI + Error status
				renderCardViewBase({
					metadata,
					status: 'error',
				});
				expect(screen.queryByText('Failed to load')).not.toBeInTheDocument();
			});

			it(`should not render when there is PollingMaxAttemptsError"`, () => {
				const error = new MediaCardError('error-file-state', createPollingMaxAttemptsError());

				const metadata: FileDetails = {
					id: 'some-id',
					name: 'some-file-name',
					createdAt: 123456,
				};

				renderCardViewBase({
					metadata,
					status: 'error',
					cardPreview,
					error,
				});

				expect(screen.queryByText('Failed to load')).not.toBeInTheDocument();
			});
		});

		it(`should render ProgressBar when status is uploading`, () => {
			const progress = 0.6;
			renderCardViewBase({ status: 'uploading', progress });
			expect(screen.queryByRole('progressbar')).toBeInTheDocument();
		});

		describe('CreatingPreview', () => {
			it(`should render CreatingPreview when status is processing`, () => {
				renderCardViewBase({ status: 'processing' });
				expect(screen.queryByText('Creating preview...')).toBeInTheDocument();
			});

			it(`should not render CreatingPreview when file size is zero`, () => {
				renderCardViewBase({
					status: 'complete',
					metadata: {
						id: 'some-id',
						createdAt: 1608505590086,
						mediaType: 'unknown',
						mimeType: 'inode/x-empty',
						name: 'zero-length-file',
						processingStatus: 'succeeded',
						size: 0,
					},
				});
				expect(screen.queryByText('Creating preview...')).not.toBeInTheDocument();
			});
		});

		it(`should render Preview RateLimited Error message when there is upload error and overlay is disabled`, () => {
			const error = new MediaCardError('upload');

			renderCardViewBase({
				error,
				// CardView replies on the status more than the error passed. TODO: fix this?
				status: 'error',
				disableOverlay: true,
			});
			expect(screen.getByText('Failed to upload')).toBeInTheDocument();
		});

		it(`should render Preview Unavailable when status is failed-processing`, () => {
			const metadata: FileDetails = {
				id: 'some-id',
				name: 'some-name',
				mediaType: 'image',
			};

			renderCardViewBase({
				status: 'failed-processing',
				metadata,
			});

			// With broken dataURI
			renderCardViewBase({
				status: 'failed-processing',
				metadata,
				cardPreview,
			});
			expect(screen.queryAllByText('Preview Unavailable').length).toBe(2);
		});

		it(`should render PreviewCurrentlyUnavailable when there is PollingMaxAttemptsError`, () => {
			const error = new MediaCardError('error-file-state', createPollingMaxAttemptsError());
			const metadata: FileDetails = {
				id: 'some-id',
				name: 'some-name',
				mediaType: 'image',
			};

			const { queryByText } = renderCardViewBase({
				status: 'error',
				metadata: metadata,
				error,
			});

			expect(queryByText('Preview currently unavailable')).toBeInTheDocument();
		});

		it(`should render ImageRenderer when preview is defined`, () => {
			const metadata: FileDetails = {
				id: 'some-id',
				mediaType: 'image',
			};
			const cardProps: CardViewProps = {
				cardPreview,
				status: 'complete',
				mediaItemType: 'file',
				metadata,
				alt: 'some-image',
				resizeMode: 'crop',
				onDisplayImage: () => {},
				onImageError: jest.fn(),
				onImageLoad: jest.fn(),
				nativeLazyLoad: true,
				forceSyncDisplay: true,
				dimensions: { width: 100, height: 100 },
			};
			renderCardViewBase(cardProps);
			expect(screen.queryByTestId(imgTestId)).toBeInTheDocument();
		});

		describe('Tickbox', () => {
			it('should render if selectable is true', () => {
				render(
					<CardViewBase
						status="loading"
						mediaItemType="file"
						selectable={true}
						dimensions={{ width: 100, height: 100 }}
					/>,
				);
				expect(screen.queryByRole('img', { name: 'tick' })).toBeInTheDocument();
			});
			it('should not render if selectable is false', () => {
				render(
					<CardViewBase
						status="loading"
						mediaItemType="file"
						selectable={false}
						dimensions={{ width: 100, height: 100 }}
					/>,
				);
				expect(screen.queryByRole('img', { name: 'tick' })).not.toBeInTheDocument();
			});
			it('should not render if disableOverlay is true', () => {
				render(
					<CardViewBase
						status="loading"
						mediaItemType="file"
						selectable={true}
						disableOverlay={true}
						dimensions={{ width: 100, height: 100 }}
					/>,
				);
				expect(screen.queryByRole('img', { name: 'tick' })).not.toBeInTheDocument();
			});
		});

		describe('Tooltip', () => {
			it('should render the tooltip when overlay is enabled and there is filename', () => {
				renderCardViewBase({
					metadata: { name: 'charlie.jpg' } as any,
				});

				const tooltip = screen.queryByRole('presentation');
				expect(tooltip).toBeInTheDocument();
			});

			it('should not render the tooltip when overlay is disabled and there is filename', () => {
				renderCardViewBase({
					metadata: { name: 'charlie.jpg' } as any,
					disableOverlay: true,
				});
				expect(screen.queryByText('charlie.jpg')).not.toBeInTheDocument();
			});

			/*
        Tooltip should not rely on metadata. That causes flicker
        on the image when metadata is fetched.
      */
			it('should render the tooltip if there is no filename', () => {
				// Without filename and overlay enabled
				renderCardViewBase();
				expect(screen.queryByRole('presentation')).toBeInTheDocument();
			});

			it('should not render the tooltip if shouldHideTooltip is set to `true`', () => {
				// Without filename and overlay enabled
				renderCardViewBase({ shouldHideTooltip: true });
				expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
			});
		});
	});

	it('should render actions with accessible labels', async () => {
		const user = userEvent.setup();
		const downloadAction = {
			label: 'Download',
			handler: jest.fn(),
			icon: <DownloadIcon size="small" label="annotate" />,
		};

		const screen = render(
			<CardView
				status="complete"
				mediaItemType="file"
				cardPreview={cardPreview}
				metadata={file}
				resizeMode="stretchy-fit"
				dimensions={{ width: 100, height: 100 }}
				actions={[downloadAction]}
			/>,
		);

		const downloadButton = await screen.findByLabelText('my-file — Download');
		await user.click(downloadButton);

		expect(downloadAction.handler).toHaveBeenCalledTimes(1);
	});
});
