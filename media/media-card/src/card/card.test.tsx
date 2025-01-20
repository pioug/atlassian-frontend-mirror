jest.mock('@atlaskit/analytics-next', () => {
	const actualModule = jest.requireActual('@atlaskit/analytics-next');
	return {
		__esModule: true,
		...actualModule,
		useAnalyticsEvents: jest.fn(),
	};
});

jest.mock('../utils/ufoExperiences', () => {
	const actualModule = jest.requireActual('../utils/ufoExperiences');
	return {
		__esModule: true,
		...actualModule,
		startUfoExperience: jest.fn(actualModule.startUfoExperience),
		completeUfoExperience: jest.fn(actualModule.completeUfoExperience),
		abortUfoExperience: jest.fn(actualModule.abortUfoExperience),
	};
});
import { useAnalyticsEvents, type CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import * as svgHelpersModule from './svgView/helpers';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CardLoader from './cardLoader';
import React from 'react';
import { MockedMediaClientProvider } from '@atlaskit/media-client-react/test-helpers';
import { createMockedMediaClientProvider } from '../utils/__tests__/utils/mockedMediaClientProvider/_MockedMediaClientProvider';
import { createMockedMediaApi } from '@atlaskit/media-client/test-helpers';
import { generateSampleFileItem, sampleBinaries } from '@atlaskit/media-test-data';
import { tallImage, asMockFunction, sleep } from '@atlaskit/media-test-helpers';
import {
	createServerUnauthorizedError,
	createRateLimitedError,
	createPollingMaxAttemptsError,
} from '@atlaskit/media-client/test-helpers';
import {
	imgTestId,
	spinnerTestId,
	cardTestId,
	mediaViewerTestId,
	titleBoxTestId,
} from '../__tests__/utils/_testIDs';
import {
	type MediaClientConfig,
	globalMediaEventEmitter,
	type ImageResizeMode,
} from '@atlaskit/media-client';
import * as performanceModule from './performance';
import { getFileStreamsCache } from '@atlaskit/media-client';
import { IntlProvider } from 'react-intl-next';
import { completeUfoExperience, abortUfoExperience } from '../utils/ufoExperiences';
import { MediaCardError } from '../errors';
import { MockIntersectionObserver } from '../utils/mockIntersectionObserver';
import { DateOverrideContext } from '../dateOverrideContext';
import { ANALYTICS_MEDIA_CHANNEL } from '@atlaskit/media-common';
import { ffTest } from '@atlassian/feature-flags-test-utils';

const event = { fire: jest.fn() };
const mockCreateAnalyticsEvent = jest.fn(() => event) as unknown as CreateUIAnalyticsEvent;

asMockFunction(useAnalyticsEvents).mockReturnValue({
	createAnalyticsEvent: mockCreateAnalyticsEvent,
});

const calculateSvgDimensionsMock = jest.spyOn(svgHelpersModule, 'calculateSvgDimensions');

const dummyMediaClientConfig = {} as MediaClientConfig;

const GLOBAL_MEDIA_CARD_SSR = 'mediaCardSsr';
const GLOBAL_MEDIA_NAMESPACE = '__MEDIA_INTERNAL';
const PERFORMANCE_NOW = 1000;

const setGlobalSSRData = (id: string, data: any) => {
	// @ts-ignore
	window[GLOBAL_MEDIA_NAMESPACE] = { [GLOBAL_MEDIA_CARD_SSR]: { [id]: data } };
};

describe('Card ', () => {
	let currentObserver: any;
	const intersectionObserver = new MockIntersectionObserver();

	const makeVisible = () => {
		act(() => {
			intersectionObserver.triggerIntersect({
				target: currentObserver,
				isIntersecting: true,
			});
		});
	};

	// TODO: Remove this workaround that avoids a race condition between two functions that set card status
	// Tracked by + explained in more detail in https://product-fabric.atlassian.net/browse/CXP-3751
	const simulateImageLoadDelay = async () => {
		await sleep(100);
	};

	beforeEach(() => {
		jest.clearAllMocks();

		jest.spyOn(globalMediaEventEmitter, 'emit');
		/*
      NOTE: This test case's speed can be improved by implementing jest.useFakeTimers({doNotFake: ['performance']}) after adopting jest version 28.x and above, see https://jest-archive-august-2023.netlify.app/docs/28.x/jest-object#jestusefaketimersfaketimersconfig for more detail.
    */
		jest.spyOn(performanceModule, 'performanceNow').mockReturnValue(PERFORMANCE_NOW);

		intersectionObserver.setup({
			observe: (elem?: any) => {
				currentObserver = elem;
			},
			disconnect: () => {},
		});

		// @ts-ignore
		delete window[GLOBAL_MEDIA_NAMESPACE];
	});

	afterEach(() => {
		// clear file streams cache so that the state
		// that is not managed by media-state will be reset
		getFileStreamsCache().removeAll();

		intersectionObserver.cleanup();
	});

	describe('should manage lazy loading', () => {
		it('should lazy load by default', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader mediaClientConfig={dummyMediaClientConfig} identifier={identifier} />
				</MockedMediaClientProvider>,
			);
			// should always render image
			expect(await screen.findByTestId(imgTestId)).toBeInTheDocument();

			// should not render title box details
			expect(screen.queryByText(fileItem.details.name)).not.toBeInTheDocument();
			expect(screen.queryByText('04 Aug 2023, 01:40 AM')).not.toBeInTheDocument();
			expect(screen.queryByLabelText('Warning')).not.toBeInTheDocument();

			// should not render a file type icon
			expect(screen.queryByLabelText('pdf')).not.toBeInTheDocument();

			// should render a spinner icon
			expect(screen.getByTestId(spinnerTestId)).toBeInTheDocument();
		});

		it('should load image when card comes into view', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader mediaClientConfig={dummyMediaClientConfig} identifier={identifier} />
				</MockedMediaClientProvider>,
			);

			// wait for ViewportDetector to be mounted before turning the card visible
			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'loading',
				),
			);
			makeVisible();

			const img = await screen.findByTestId(imgTestId);
			expect(img).toBeInTheDocument();
			// Should not native lazy load when becomes visible
			expect(img.getAttribute('loading')).toBeNull();
		});

		it('should render immediately when not set to lazy load', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
					/>
				</MockedMediaClientProvider>,
			);

			// simulate that the file has been fully loaded by the browser
			const img = await screen.findByTestId(imgTestId, undefined);
			await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());
			await simulateImageLoadDelay();
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'complete',
				),
			);
		});

		it('should enable native lazy loading when the preview is from global scope and card is out of the viewport', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			const { id, collectionName } = identifier;
			const expectedPreview = { dataURI: tallImage, source: 'ssr-data' };

			setGlobalSSRData(`${id}-${collectionName}`, expectedPreview);

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={true}
						ssr="client"
					/>
				</MockedMediaClientProvider>,
			);

			expect(screen.getByTestId(spinnerTestId)).toBeInTheDocument();
			const img = await screen.findByTestId(imgTestId);
			expect(img.getAttribute('loading')).toEqual('lazy');
		});

		it.each(['server', 'client'] as const)(
			`should enable native lazy load if preview is SSR and card is out of the viewport (preview source: %s)`,
			async (ssr) => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const dimensions = { width: 100, height: 100 };

				const { mediaApi } = createMockedMediaApi([fileItem]);

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy
							dimensions={dimensions}
							ssr={ssr}
						/>
					</MockedMediaClientProvider>,
				);

				expect(screen.getByTestId(spinnerTestId)).toBeInTheDocument();
				const img = await screen.findByTestId(imgTestId);
				expect(img.getAttribute('loading')).toBe('lazy');
			},
		);
	});

	describe('should trigger callbacks', () => {
		it('for onClick when the card is clicked upon', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			const user = userEvent.setup();
			const onClick = jest.fn();

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
						onClick={onClick}
					/>
				</MockedMediaClientProvider>,
			);

			// simulate that the file has been fully loaded by the browser
			const img = await screen.findByTestId(imgTestId, undefined);
			await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());
			await simulateImageLoadDelay();
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'complete',
				),
			);

			const card = screen.getByTestId(cardTestId);
			await user.click(card);
			expect(onClick).toHaveBeenCalledTimes(1);
		});

		it('for onMouseEnter when the mouse enters the card', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			const user = userEvent.setup();
			const onMouseEnter = jest.fn();

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
						onMouseEnter={onMouseEnter}
					/>
				</MockedMediaClientProvider>,
			);

			// simulate that the file has been fully loaded by the browser
			const img = await screen.findByTestId(imgTestId, undefined);
			await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());
			await simulateImageLoadDelay();
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'complete',
				),
			);

			const card = screen.getByTestId(cardTestId);
			await user.hover(card);
			expect(onMouseEnter).toHaveBeenCalledTimes(1);
		});

		// TODO - missing onFullscreenChange callback
	});

	describe('should render an accessible preview (i.e. <img>)', () => {
		it('should render preview with name as the alternative text by default', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
					/>
				</MockedMediaClientProvider>,
			);

			// simulate that the file has been fully loaded by the browser
			const img = await screen.findByTestId(imgTestId, undefined);
			await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());
			await simulateImageLoadDelay();
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'complete',
				),
			);

			expect((img as HTMLImageElement).alt).toBe('name.pdf');
		});

		it('should render preview without the alternative text if an empty string is provided', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
						alt=""
					/>
				</MockedMediaClientProvider>,
			);

			// simulate that the file has been fully loaded by the browser
			const img = await screen.findByTestId(imgTestId, undefined);
			await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());
			await simulateImageLoadDelay();
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'complete',
				),
			);

			expect((img as HTMLImageElement).alt).toBe('');
		});

		it('should render preview with alternative text when "alt" is provided', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
						alt="alt text"
					/>
				</MockedMediaClientProvider>,
			);

			// simulate that the file has been fully loaded by the browser
			const img = await screen.findByTestId(imgTestId, undefined);
			await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());
			await simulateImageLoadDelay();
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'complete',
				),
			);

			expect((img as HTMLImageElement).alt).toBe('alt text');
		});

		it('should render preview with mediaBlobUrlAttrs attached', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
						contextId={'some-context'}
						alt={'alt text'}
						dimensions={{ width: 100, height: 100 }}
					/>
				</MockedMediaClientProvider>,
			);

			// simulate that the file has been fully loaded by the browser
			const img = await screen.findByTestId(imgTestId, undefined);
			await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());
			await simulateImageLoadDelay();
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'complete',
				),
			);

			expect((img as HTMLImageElement).src).toContain(
				`#media-blob-url=true&id=${identifier.id}&collection=${identifier.collectionName}&contextId=some-context&width=100&height=100&alt=alt%20text`,
			);
		});
	});

	describe('should manage its resize mode', () => {
		it('should render "crop" resize mode by default', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
					/>
				</MockedMediaClientProvider>,
			);

			// simulate that the file has been fully loaded by the browser
			const img = await screen.findByTestId(imgTestId, undefined);
			await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());
			await simulateImageLoadDelay();
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'complete',
				),
			);

			const style = window.getComputedStyle(img);
			expect(style.maxWidth).toBe('100%');
			expect(style.maxHeight).toBe('');
		});

		// TODO - investigate if "fit" and "full-fit" are redundantly identical
		it('should render "fit" resize mode correctly', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
						resizeMode="fit"
					/>
				</MockedMediaClientProvider>,
			);

			// simulate that the file has been fully loaded by the browser
			const img = await screen.findByTestId(imgTestId, undefined);
			await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());
			await simulateImageLoadDelay();
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'complete',
				),
			);

			const style = window.getComputedStyle(img);
			expect(style.maxWidth).toBe('100%');
			expect(style.maxHeight).toBe('100%');
		});

		it('should render "full-fit" resize mode correctly', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
						resizeMode="full-fit"
					/>
				</MockedMediaClientProvider>,
			);

			// simulate that the file has been fully loaded by the browser
			const img = await screen.findByTestId(imgTestId, undefined);
			await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());
			await simulateImageLoadDelay();
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'complete',
				),
			);

			const style = window.getComputedStyle(img);
			expect(style.maxWidth).toBe('100%');
			expect(style.maxHeight).toBe('100%');
		});

		it('should render "stretchy-fit" resize mode correctly', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
						resizeMode="stretchy-fit"
					/>
				</MockedMediaClientProvider>,
			);

			// simulate that the file has been fully loaded by the browser
			const img = await screen.findByTestId(imgTestId, undefined);
			await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());
			await simulateImageLoadDelay();
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'complete',
				),
			);

			const style = window.getComputedStyle(img);
			expect(style.maxWidth).toBe('');
			expect(style.maxHeight).toBe('');
			expect(style.height).toBe('100%');
		});
	});

	describe('should manage its dimensions', () => {
		it('should use default dimensions for the default "image" appearance', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
					/>
				</MockedMediaClientProvider>,
			);

			const card = await screen.findByTestId(cardTestId);
			const style = window.getComputedStyle(card);
			expect(style.height).toBe('125px');
			expect(style.width).toBe('156px');
		});

		it('should use default dimensions for a "square" appearance', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
						appearance="square"
					/>
				</MockedMediaClientProvider>,
			);

			const card = await screen.findByTestId(cardTestId);
			const style = window.getComputedStyle(card);
			expect(style.height).toBe('300px');
			expect(style.width).toBe('300px');
		});

		it('should use default dimensions for a "horizontal" appearance', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
						appearance="horizontal"
					/>
				</MockedMediaClientProvider>,
			);

			const card = await screen.findByTestId(cardTestId);
			const style = window.getComputedStyle(card);
			expect(style.height).toBe('125px');
			expect(style.width).toBe('435px');
		});

		it('should update with new dimensions', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			const { rerender } = render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
						dimensions={{ width: 100, height: 500 }}
					/>
				</MockedMediaClientProvider>,
			);

			expect(await screen.findByTestId(cardTestId)).toBeInTheDocument();

			rerender(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
						dimensions={{ width: 400, height: 400 }}
					/>
				</MockedMediaClientProvider>,
			);

			const card = await screen.findByTestId(cardTestId);
			const style = window.getComputedStyle(card);
			expect(style.height).toBe('400px');
			expect(style.width).toBe('400px');
		});

		it('should set custom dimensions', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
						appearance="square"
						dimensions={{ width: 100, height: 500 }}
					/>
				</MockedMediaClientProvider>,
			);

			const card = await screen.findByTestId(cardTestId);
			const style = window.getComputedStyle(card);
			expect(style.height).toBe('500px');
			expect(style.width).toBe('100px');
		});

		it('should set custom percentage dimensions', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
						appearance="square"
						dimensions={{ width: '20%', height: '20%' }}
					/>
				</MockedMediaClientProvider>,
			);

			const card = await screen.findByTestId(cardTestId);
			const style = window.getComputedStyle(card);
			expect(style.height).toBe('20%');
			expect(style.width).toBe('20%');
		});

		// TODO - this actually successfully renders but has bad behaviour: it renders to be 100% width and 0 height (i.e. you can't see it)
		it.skip('should ignore invalid custom dimensions', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
						appearance="square"
						dimensions={{ width: 'invalid', height: 'invalid' }}
					/>
				</MockedMediaClientProvider>,
			);

			const card = await screen.findByTestId(cardTestId);
			const style = window.getComputedStyle(card);
			expect(style.height).toBe('300px');
			expect(style.width).toBe('300px');
		});
	});

	describe('should manage its orientation', () => {
		it('should not rotate the preview by default (i.e. preview has an orientation of 1)', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
					/>
				</MockedMediaClientProvider>,
			);

			// simulate that the file has been fully loaded by the browser
			const img = await screen.findByTestId(imgTestId, undefined);
			await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());
			await simulateImageLoadDelay();
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'complete',
				),
			);
			const style = window.getComputedStyle(img);
			expect(style.transform).not.toContain('rotate');
		});

		const rotated = sampleBinaries.jpgRotated();
		type BinaryKey = keyof Awaited<typeof rotated>;
		type TestArgs = { binaryKey: BinaryKey; result: string };

		it.each`
			binaryKey       | rotation | result
			${'landscape2'} | ${2}     | ${'rotateY(180deg)'}
			${'landscape3'} | ${3}     | ${'rotate(180deg)'}
			${'landscape4'} | ${4}     | ${'rotateY(180deg)'}
			${'landscape5'} | ${5}     | ${'rotateY(180deg)'}
			${'landscape6'} | ${6}     | ${'rotate(90deg)'}
			${'landscape7'} | ${7}     | ${'rotateY(180deg)'}
			${'landscape8'} | ${8}     | ${'rotate(270deg)'}
		`(
			'should rotate the preview if it has an orientation equal to $rotation',
			async ({ binaryKey, result }: TestArgs) => {
				const binary = (await rotated)[binaryKey];

				const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
				const { MockedMediaClientProvider, uploadItem } = createMockedMediaClientProvider({
					initialItems: fileItem,
				});

				// We only rotate local preview
				uploadItem(fileItem, 0.5, binary);

				const dimensions = { width: 100, height: 100 };

				render(
					<MockedMediaClientProvider>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
							dimensions={dimensions}
						/>
					</MockedMediaClientProvider>,
				);

				// simulate that the file has been fully loaded by the browser
				const img = await screen.findByTestId(imgTestId);
				await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());
				await simulateImageLoadDelay();
				fireEvent.load(img);

				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'uploading',
					),
				);

				const style = window.getComputedStyle(img);
				expect(style.transform).toContain(result);
			},
		);
	});

	// TODO - should demonstrate its selection by its role
	describe('should manage its selection', () => {
		it('should render as not selected by default', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
					/>
				</MockedMediaClientProvider>,
			);

			// simulate that the file has been fully loaded by the browser
			const img = await screen.findByTestId(imgTestId, undefined);
			await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());
			await simulateImageLoadDelay();
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'complete',
				),
			);

			// should not be selected
			expect(await screen.findByTestId('media-file-card-view')).not.toHaveAttribute(
				'data-test-selected',
			);
		});

		it('should render as selected', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
						selected
					/>
				</MockedMediaClientProvider>,
			);

			// simulate that the file has been fully loaded by the browser
			const img = await screen.findByTestId(imgTestId, undefined);
			await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());
			await simulateImageLoadDelay();
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'complete',
				),
			);

			// should be selected
			expect(document.querySelector('[data-test-selected="true"]')).toBeInTheDocument();
		});
	});

	describe('should render a tick box appropriately', () => {
		it('should not render a tick box by default', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
					/>
				</MockedMediaClientProvider>,
			);

			// simulate that the file has been fully loaded by the browser
			const img = await screen.findByTestId(imgTestId, undefined);
			await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());
			await simulateImageLoadDelay();
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'complete',
				),
			);

			expect(screen.queryByLabelText('tick')).not.toBeInTheDocument();
		});

		it('should render a tick box when the card is "selectable"', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
						selectable
					/>
				</MockedMediaClientProvider>,
			);

			// simulate that the file has been fully loaded by the browser
			const img = await screen.findByTestId(imgTestId, undefined);
			await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());
			await simulateImageLoadDelay();
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'complete',
				),
			);

			expect(screen.getByLabelText('tick')).toBeInTheDocument();
		});
	});

	describe('should render card correctly', () => {
		describe('when "disableOverlay" is false by default', () => {
			it('when there is no remote preview', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithoutRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// card should completely process the error
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'complete',
					),
				);

				// should render an image
				expect(screen.queryByTestId(imgTestId)).toBeInTheDocument();

				// should render title box correctly
				expect(screen.queryByTestId(titleBoxTestId)).toBeInTheDocument();
				expect(screen.queryByText(fileItem.details.name)).toBeInTheDocument();
				expect(screen.queryByText('04 Aug 2023, 01:40 AM')).toBeInTheDocument();
				expect(screen.queryByLabelText('Warning')).not.toBeInTheDocument();

				// should render error message correctly
				expect(screen.queryByText('Preview unavailable')).not.toBeInTheDocument();

				// should render file type icon correctly
				expect(screen.queryByLabelText('pdf')).toBeInTheDocument();

				// should not render a spinner
				expect(screen.queryByTestId(spinnerTestId)).not.toBeInTheDocument();

				// should not render a progress bar
				expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
			});

			it('when fetching the remote preview errors out (RemotePreviewError: remote-preview-fetch)', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);
				mediaApi.getImage = async () => {
					throw new Error('remote-preview-fetch');
				};

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// card should completely process the error
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'error',
					),
				);

				// should not render a preview img
				expect(screen.queryByTestId(imgTestId)).not.toBeInTheDocument();

				// should render title box correctly
				expect(screen.queryByTestId(titleBoxTestId)).toBeInTheDocument();
				expect(screen.queryByText(fileItem.details.name)).toBeInTheDocument();
				expect(screen.queryByText('04 Aug 2023, 01:40 AM')).toBeInTheDocument();
				expect(screen.queryByLabelText('Warning')).not.toBeInTheDocument();

				// should render error message correctly
				expect(screen.queryByText('Preview unavailable')).toBeInTheDocument();

				// should render file type icon correctly
				expect(screen.queryByLabelText('pdf')).toBeInTheDocument();

				// should not render a spinner
				expect(screen.queryByTestId(spinnerTestId)).not.toBeInTheDocument();

				// should not render a progress bar
				expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
			});

			it('when loading the remote preview errors out (ImageLoadError: remote-uri)', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);

				mediaApi.getImage = async () => new Blob(); // empty blob will cause an error

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// card should be attempting to load the preview
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'loading-preview',
					),
				);

				// simulate that the file was unsuccessfully loaded in the browser
				const img = await screen.findByTestId(imgTestId);
				fireEvent.error(img);

				// card should completely process the error
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'error',
					),
				);

				// should render title box correctly
				expect(screen.queryByTestId(titleBoxTestId)).toBeInTheDocument();
				expect(screen.queryByText(fileItem.details.name)).toBeInTheDocument();
				expect(screen.queryByText('04 Aug 2023, 01:40 AM')).toBeInTheDocument();
				expect(screen.queryByLabelText('Warning')).not.toBeInTheDocument();

				// should render error message correctly
				expect(screen.queryByText('Preview unavailable')).toBeInTheDocument();

				// should render file type icon correctly
				expect(screen.queryByLabelText('pdf')).toBeInTheDocument();

				// should not render a spinner
				expect(screen.queryByTestId(spinnerTestId)).not.toBeInTheDocument();

				// should not render a progress bar
				expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
			});

			it('when a serverRateLimited error occurs (RequestError: serverRateLimited)', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);

				mediaApi.getItems = () => {
					throw createRateLimitedError();
				};

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// card should completely process the error
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'error',
					),
				);

				// should render title box correctly
				expect(screen.queryByTestId(titleBoxTestId)).toBeInTheDocument();
				expect(screen.queryByText(fileItem.details.name)).not.toBeInTheDocument();
				expect(screen.queryByText('04 Aug 2023, 01:40 AM')).not.toBeInTheDocument();
				expect(screen.queryByLabelText('Warning')).toBeInTheDocument();

				// should render error message correctly
				expect(screen.queryByText('Failed to load')).toBeInTheDocument();

				// should render file type icon correctly
				expect(screen.queryByLabelText('media-type')).toBeInTheDocument();

				// should not render a spinner
				expect(screen.queryByTestId(spinnerTestId)).not.toBeInTheDocument();

				// should not render a progress bar
				expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
			});

			it('when a pollingMaxAttemptsExceeded error occurs (PollingError: pollingMaxAttemptsExceeded)', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);

				mediaApi.getItems = () => {
					throw createPollingMaxAttemptsError();
				};

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// card should completely process the error
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'error',
					),
				);

				// should render title box correctly
				expect(screen.queryByTestId(titleBoxTestId)).toBeInTheDocument();
				expect(screen.queryByText(fileItem.details.name)).not.toBeInTheDocument();
				expect(screen.queryByText('04 Aug 2023, 01:40 AM')).not.toBeInTheDocument();
				expect(screen.queryByLabelText('Warning')).toBeInTheDocument();

				// should render error message correctly
				expect(screen.queryByText('Failed to load')).toBeInTheDocument();

				// should render file type icon correctly
				expect(screen.queryByLabelText('media-type')).toBeInTheDocument();

				// should not render a spinner
				expect(screen.queryByTestId(spinnerTestId)).not.toBeInTheDocument();

				// should not render a progress bar
				expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
			});

			it('when there is an empty items error (emptyItems, metadata-fetch)', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(); // Intentionally skipping fileItem

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// card should completely process the error
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'error',
					),
				);

				// should render title box correctly
				expect(screen.queryByTestId(titleBoxTestId)).toBeInTheDocument();
				expect(screen.queryByText(fileItem.details.name)).not.toBeInTheDocument();
				expect(screen.queryByText('04 Aug 2023, 01:40 AM')).not.toBeInTheDocument();
				expect(screen.queryByLabelText('Warning')).toBeInTheDocument();

				// should render error message correctly
				expect(screen.queryByText('Failed to load')).toBeInTheDocument();

				// should render file type icon correctly
				expect(screen.queryByLabelText('media-type')).toBeInTheDocument();

				// should not render a spinner
				expect(screen.queryByTestId(spinnerTestId)).not.toBeInTheDocument();

				// should not render a progress bar
				expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
			});

			it('when file id is invalid (invalidFileId, metadata-fetch)', async () => {
				const [fileItem, baseIdentifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);
				const identifier = { ...baseIdentifier, id: 'INVALID ID' };

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// card should completely process the error
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'error',
					),
				);

				// should render title box correctly
				expect(screen.queryByTestId(titleBoxTestId)).toBeInTheDocument();
				expect(screen.queryByText(fileItem.details.name)).not.toBeInTheDocument();
				expect(screen.queryByText('04 Aug 2023, 01:40 AM')).not.toBeInTheDocument();
				expect(screen.queryByLabelText('Warning')).toBeInTheDocument();

				// should render error message correctly
				expect(screen.queryByText('Failed to load')).toBeInTheDocument();

				// should render file type icon correctly
				expect(screen.queryByLabelText('media-type')).toBeInTheDocument();

				// should not render a spinner
				expect(screen.queryByTestId(spinnerTestId)).not.toBeInTheDocument();

				// should not render a progress bar
				expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
			});

			it('when backend fails to process the file (status: failed-processing) ', async () => {
				const [fileItem, identifier] = generateSampleFileItem.failedPdf();
				const { mediaApi } = createMockedMediaApi(fileItem);

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// card should completely process the error
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'failed-processing',
					),
				);

				// should provide a download action
				expect(screen.queryByLabelText('Download')).toBeInTheDocument();

				// should render title box correctly
				expect(screen.queryByTestId(titleBoxTestId)).toBeInTheDocument();
				expect(screen.queryByText(fileItem.details.name)).toBeInTheDocument();
				expect(screen.queryByText('04 Aug 2023, 01:40 AM')).toBeInTheDocument();
				expect(screen.queryByLabelText('Warning')).not.toBeInTheDocument();

				// should render error message correctly
				expect(screen.queryByText('Preview unavailable')).toBeInTheDocument();

				// should render file type icon correctly
				expect(screen.queryByLabelText('pdf')).toBeInTheDocument();

				// should render a spinner
				expect(screen.queryByTestId(spinnerTestId)).not.toBeInTheDocument();

				// should not render a progress bar
				expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
			});

			it('when loading', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader mediaClientConfig={dummyMediaClientConfig} identifier={identifier} />
					</MockedMediaClientProvider>,
				);

				// should not render title box contents
				expect(screen.queryByText(fileItem.details.name)).not.toBeInTheDocument();
				expect(screen.queryByText('04 Aug 2023, 01:40 AM')).not.toBeInTheDocument();
				expect(screen.queryByLabelText('Warning')).not.toBeInTheDocument();

				// should not render a file type icon
				expect(screen.queryByLabelText('pdf')).not.toBeInTheDocument();

				// should render a spinner
				expect(screen.queryByTestId(spinnerTestId)).toBeInTheDocument();

				// should not render a progress bar
				expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
			});

			it('when backend is processing the file (status: processing)', async () => {
				const [fileItem, identifier] = generateSampleFileItem.processingPdf();
				const { mediaApi } = createMockedMediaApi(fileItem);

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// card should be processing
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'processing',
					),
				);

				// should render title box correctly
				expect(screen.queryByTestId(titleBoxTestId)).toBeInTheDocument();
				expect(screen.queryByText(fileItem.details.name)).toBeInTheDocument();
				expect(screen.queryByText('24 Aug 2023, 05:11 AM')).toBeInTheDocument();

				// should render file type icon correctly
				expect(screen.queryByLabelText('pdf')).toBeInTheDocument();

				// should render message correctly
				expect(screen.queryByText('Creating preview...')).toBeInTheDocument();

				// should not render a spinner
				expect(screen.queryByTestId(spinnerTestId)).not.toBeInTheDocument();

				// should not render a progress bar
				expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
			});

			it('when uploading with a progress of 0', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { MockedMediaClientProvider, uploadItem } = createMockedMediaClientProvider({
					initialItems: fileItem,
				});

				uploadItem(fileItem, 0);

				render(
					<MockedMediaClientProvider>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// card should be uploading
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'uploading',
					),
				);

				// should render an image
				expect(screen.queryByTestId(imgTestId)).toBeInTheDocument();

				// should render title box correctly
				expect(screen.queryByTestId(titleBoxTestId)).toBeInTheDocument();
				expect(screen.queryByText(fileItem.details.name)).toBeInTheDocument();
				expect(screen.queryByText('24 Aug 2023, 05:11 AM')).not.toBeInTheDocument();

				// should render file type icon correctly
				expect(screen.queryByLabelText('pdf')).toBeInTheDocument();

				// should not render a creating preview message
				expect(screen.queryByText('Creating preview...')).not.toBeInTheDocument();

				// should not render a spinner
				expect(screen.queryByTestId(spinnerTestId)).not.toBeInTheDocument();

				// should render a progress bar correctly
				expect(screen.queryByRole('progressbar')).toBeInTheDocument();
				expect(document.querySelector('[aria-valuenow="0"]')).toBeInTheDocument();
				expect(document.querySelector('[data-test-progress="0"]')).toBeInTheDocument();
			});

			it('when uploading with a progress of 0.5', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { MockedMediaClientProvider, uploadItem } = createMockedMediaClientProvider({
					initialItems: fileItem,
				});

				uploadItem(fileItem, 0.5);

				render(
					<MockedMediaClientProvider>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// card should be uploading
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'uploading',
					),
				);

				// should render an image
				expect(screen.queryByTestId(imgTestId)).toBeInTheDocument();

				// should render title box correctly
				expect(screen.queryByTestId(titleBoxTestId)).toBeInTheDocument();
				expect(screen.queryByText(fileItem.details.name)).toBeInTheDocument();
				expect(screen.queryByText('24 Aug 2023, 05:11 AM')).not.toBeInTheDocument();

				// should render file type icon correctly
				expect(screen.queryByLabelText('pdf')).toBeInTheDocument();

				// should not render a creating preview message
				expect(screen.queryByText('Creating preview...')).not.toBeInTheDocument();

				// should not render a spinner
				expect(screen.queryByTestId(spinnerTestId)).not.toBeInTheDocument();

				// should render a progress bar correctly
				expect(screen.queryByRole('progressbar')).toBeInTheDocument();
				expect(document.querySelector('[aria-valuenow="50"]')).toBeInTheDocument();
				expect(document.querySelector('[data-test-progress="0.5"]')).toBeInTheDocument();
			});

			it('when successfully being processed after uploading without a local preview', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { MockedMediaClientProvider, uploadItem, processItem } =
					createMockedMediaClientProvider({
						initialItems: fileItem,
					});

				uploadItem(fileItem, 0.5);

				render(
					<MockedMediaClientProvider>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// card should be attempting in uploading status
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'uploading',
					),
				);

				uploadItem(fileItem, 1);
				processItem(fileItem, 1);

				// simulate that the file has been fully loaded by the browser
				const img = await screen.findByTestId(imgTestId, undefined);
				await waitFor(() => expect(img.getAttribute('src')).toBeTruthy(), { timeout: 1500 });
				await simulateImageLoadDelay();
				fireEvent.load(img);

				// card should be fully processed
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'complete',
					),
				);

				// should render title box correctly
				expect(screen.queryByTestId(titleBoxTestId)).toBeInTheDocument();
				expect(screen.queryByText(fileItem.details.name)).toBeInTheDocument();
				expect(screen.queryByText('24 Aug 2023, 05:11 AM')).not.toBeInTheDocument();

				// should not render file type icon
				expect(screen.queryByLabelText('pdf')).not.toBeInTheDocument();

				// should not render a creating preview message
				expect(screen.queryByText('Creating preview...')).not.toBeInTheDocument();

				// should not render a spinner
				expect(screen.queryByTestId(spinnerTestId)).not.toBeInTheDocument();

				// should not render a progress bar correctly
				expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
				expect(document.querySelector('[data-test-progress="1"]')).toBeInTheDocument();
			});

			it('when uploading with a local preview', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
				const { MockedMediaClientProvider, uploadItem } = createMockedMediaClientProvider({
					initialItems: fileItem,
				});

				uploadItem(fileItem, 0.8);

				render(
					<MockedMediaClientProvider>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// should render a preview img
				await screen.findByTestId(imgTestId);

				// should render title box correctly
				expect(screen.queryByTestId(titleBoxTestId)).toBeInTheDocument();
				expect(screen.queryByText(fileItem.details.name)).toBeInTheDocument();
				expect(screen.queryByText('24 Aug 2023, 05:11 AM')).not.toBeInTheDocument();

				// should render file type icon correctly
				// expect(screen.queryByLabelText('png')).toBeInTheDocument();

				// should not render a creating preview message
				expect(screen.queryByText('Creating preview...')).not.toBeInTheDocument();

				// should not render a spinner
				expect(screen.queryByTestId(spinnerTestId)).not.toBeInTheDocument();

				// should render a progress bar correctly
				expect(screen.queryByRole('progressbar')).toBeInTheDocument();
				expect(document.querySelector('[aria-valuenow="80"]')).toBeInTheDocument();
				expect(document.querySelector('[data-test-progress="0.8"]')).toBeInTheDocument();
			});

			it('when successfully being processed after uploading with a local preview', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
				const { MockedMediaClientProvider, uploadItem, processItem } =
					createMockedMediaClientProvider({
						initialItems: fileItem,
					});

				uploadItem(fileItem, 0.5);

				render(
					<MockedMediaClientProvider>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'uploading',
					),
				);

				uploadItem(fileItem, 1);
				processItem(fileItem, 1);

				// simulate that the file has been fully loaded by the browser
				const img = await screen.findByTestId(imgTestId);
				await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());
				await simulateImageLoadDelay();
				fireEvent.load(img);

				// card should completely process the file
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'complete',
					),
				);

				// should render a preview img
				expect(screen.queryByTestId(imgTestId)).toBeInTheDocument();

				// should render title box correctly
				expect(screen.queryByTestId(titleBoxTestId)).toBeInTheDocument();
				expect(screen.queryByText(fileItem.details.name)).toBeInTheDocument();
				expect(screen.queryByText('24 Aug 2023, 05:11 AM')).not.toBeInTheDocument();

				// should render file type icon correctly
				// expect(screen.queryByLabelText('pdf')).toBeInTheDocument();

				// should not render a creating preview message
				expect(screen.queryByText('Creating preview...')).not.toBeInTheDocument();

				// should not render a spinner
				expect(screen.queryByTestId(spinnerTestId)).not.toBeInTheDocument();

				// should not render a progress bar correctly
				expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
				expect(document.querySelector('[data-test-progress="1"]')).toBeInTheDocument();
			});

			it('when the card is never loaded', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				// Skipping the file item intentionally
				const { mediaApi } = createMockedMediaApi();

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader mediaClientConfig={dummyMediaClientConfig} identifier={identifier} />
					</MockedMediaClientProvider>,
				);

				// should always render image
				expect(await screen.findByTestId(imgTestId)).toBeInTheDocument();

				// should not render title box contents
				expect(screen.queryByText(fileItem.details.name)).not.toBeInTheDocument();
				expect(screen.queryByText('24 Aug 2023, 05:11 AM')).not.toBeInTheDocument();

				// should not render a file type icon
				expect(screen.queryByLabelText('pdf')).not.toBeInTheDocument();

				// should not render a creating preview message
				expect(screen.queryByText('Creating preview...')).not.toBeInTheDocument();

				// should render a spinner
				expect(screen.queryByTestId(spinnerTestId)).toBeInTheDocument();

				// should not render a progress bar
				expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
			});

			it('when there is an upload error', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { MockedMediaClientProvider, uploadItem } = createMockedMediaClientProvider({
					initialItems: fileItem,
				});

				uploadItem(fileItem, 0.5);

				render(
					<MockedMediaClientProvider>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'uploading',
					),
				);

				uploadItem(fileItem, 'error');

				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'error',
					),
				);

				// should render title box correctly
				expect(screen.queryByTestId(titleBoxTestId)).toBeInTheDocument();
				expect(screen.queryByText(fileItem.details.name)).not.toBeInTheDocument();
				expect(screen.queryByText('04 Aug 2023, 01:40 AM')).not.toBeInTheDocument();
				expect(screen.queryByLabelText('Warning')).toBeInTheDocument();
				expect(screen.queryByText('Failed to upload')).toBeInTheDocument();

				// should render file type icon correctly
				expect(screen.queryByLabelText('pdf')).toBeInTheDocument();

				// should not render a spinner
				expect(screen.queryByTestId(spinnerTestId)).not.toBeInTheDocument();

				// should not render a progress bar
				expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
			});

			it('when an error occurs after the card is complete', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// simulate that the file has been fully loaded by the browser
				const img = await screen.findByTestId(imgTestId);
				await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());
				await simulateImageLoadDelay();
				fireEvent.load(img);

				// card should completely process the file
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'complete',
					),
				);

				// Main endpoints will fail from now
				mediaApi.getImage = async () => {
					throw new Error('random error after card is complete');
				};
				mediaApi.getItems = async () => {
					throw new Error('random error after card is complete');
				};

				// card should ignore the error
				await expect(
					waitFor(() =>
						expect(document.querySelector('[data-test-status="error"]')).toBeInTheDocument(),
					),
				).rejects.toThrow();

				// should render title box correctly
				expect(screen.queryByTestId(titleBoxTestId)).toBeInTheDocument();
				expect(screen.queryByText(fileItem.details.name)).toBeInTheDocument();
				expect(screen.queryByText('04 Aug 2023, 01:40 AM')).toBeInTheDocument();
				expect(screen.queryByLabelText('Warning')).not.toBeInTheDocument();

				// should not render an error message
				expect(screen.queryByText('Failed to load')).not.toBeInTheDocument();

				// should not render a spinner
				expect(screen.queryByTestId(spinnerTestId)).not.toBeInTheDocument();

				// should not render a progress bar
				expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
			});

			it('when DateOverride is provided', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithoutRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);

				const overridenDates = {
					[identifier.id]: 1717372607454,
				};

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<DateOverrideContext.Provider value={overridenDates}>
							<CardLoader
								mediaClientConfig={dummyMediaClientConfig}
								identifier={identifier}
								isLazy={false}
							/>
						</DateOverrideContext.Provider>
					</MockedMediaClientProvider>,
				);

				// card should completely process the error
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'complete',
					),
				);

				// should render the updated date
				expect(screen.queryByText('02 Jun 2024, 11:56 PM')).toBeInTheDocument();
			});
		});

		describe('when "disableOverlay" is true', () => {
			it('when there is no remote preview', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithoutRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
							disableOverlay
						/>
					</MockedMediaClientProvider>,
				);

				// card should completely process the error
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'complete',
					),
				);

				// should render an image
				expect(screen.queryByTestId(imgTestId)).toBeInTheDocument();

				// should not render title box
				expect(screen.queryByTestId(titleBoxTestId)).not.toBeInTheDocument();
				expect(screen.queryByText(fileItem.details.name)).not.toBeInTheDocument();
				expect(screen.queryByText('04 Aug 2023, 01:40 AM')).not.toBeInTheDocument();
				expect(screen.queryByLabelText('Warning')).not.toBeInTheDocument();

				// should render error message correctly
				expect(screen.queryByText('Preview unavailable')).not.toBeInTheDocument();

				// should render file type icon correctly
				expect(screen.queryByLabelText('pdf')).toBeInTheDocument();

				// should not render a spinner
				expect(screen.queryByTestId(spinnerTestId)).not.toBeInTheDocument();

				// should not render a progress bar
				expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
			});

			it('when fetching the remote preview errors out (RemotePreviewError: remote-preview-fetch)', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);

				mediaApi.getImage = async () => {
					throw new Error('remote-preview-fetch');
				};

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
							disableOverlay
						/>
					</MockedMediaClientProvider>,
				);

				// card should completely process the error
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'error',
					),
				);

				// should not render an image
				expect(screen.queryByTestId(imgTestId)).not.toBeInTheDocument();

				// should not render title box
				expect(screen.queryByTestId(titleBoxTestId)).not.toBeInTheDocument();
				expect(screen.queryByText(fileItem.details.name)).not.toBeInTheDocument();
				expect(screen.queryByText('04 Aug 2023, 01:40 AM')).not.toBeInTheDocument();
				expect(screen.queryByLabelText('Warning')).not.toBeInTheDocument();

				// should render error message correctly
				expect(screen.queryByText('Preview unavailable')).toBeInTheDocument();

				// should render file type icon correctly
				expect(screen.queryByLabelText('pdf')).toBeInTheDocument();

				// should not render a spinner
				expect(screen.queryByTestId(spinnerTestId)).not.toBeInTheDocument();

				// should not render a progress bar
				expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
			});

			it('when loading the remote preview errors out (ImageLoadError: remote-uri)', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);
				mediaApi.getImage = async () => new Blob();

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
							disableOverlay
						/>
					</MockedMediaClientProvider>,
				);

				// card should be attempting to load the preview
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'loading-preview',
					),
				);

				// simulate that the file was unsuccessfully loaded in the browser
				const img = await screen.findByTestId(imgTestId);
				fireEvent.error(img);

				// card should completely process the error
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'error',
					),
				);

				// should not render title box
				expect(screen.queryByTestId(titleBoxTestId)).not.toBeInTheDocument();
				expect(screen.queryByText(fileItem.details.name)).not.toBeInTheDocument();
				expect(screen.queryByText('04 Aug 2023, 01:40 AM')).not.toBeInTheDocument();
				expect(screen.queryByLabelText('Warning')).not.toBeInTheDocument();

				// should render error message correctly
				expect(screen.queryByText('Preview unavailable')).toBeInTheDocument();

				// should render file type icon correctly
				expect(screen.queryByLabelText('pdf')).toBeInTheDocument();

				// should not render a spinner
				expect(screen.queryByTestId(spinnerTestId)).not.toBeInTheDocument();

				// should not render a progress bar
				expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
			});

			it('when a serverRateLimited error occurs (RequestError: serverRateLimited)', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);

				mediaApi.getItems = () => {
					throw createRateLimitedError();
				};

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
							disableOverlay
						/>
					</MockedMediaClientProvider>,
				);

				// card should completely process the error
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'error',
					),
				);

				// should not render title box
				expect(screen.queryByTestId(titleBoxTestId)).not.toBeInTheDocument();
				expect(screen.queryByText(fileItem.details.name)).not.toBeInTheDocument();
				expect(screen.queryByText('04 Aug 2023, 01:40 AM')).not.toBeInTheDocument();
				expect(screen.queryByLabelText('Warning')).not.toBeInTheDocument();

				// should not render error message
				expect(screen.queryByText('Failed to load')).not.toBeInTheDocument();

				// should render file type icon correctly
				expect(screen.queryByLabelText('media-type')).toBeInTheDocument();

				// should not render a spinner
				expect(screen.queryByTestId(spinnerTestId)).not.toBeInTheDocument();

				// should not render a progress bar
				expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
			});

			it('when a pollingMaxAttemptsExceeded error occurs (PollingError: pollingMaxAttemptsExceeded)', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);

				mediaApi.getItems = () => {
					throw createPollingMaxAttemptsError();
				};

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
							disableOverlay
						/>
					</MockedMediaClientProvider>,
				);

				// card should completely process the error
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'error',
					),
				);

				// should not render title box
				expect(screen.queryByTestId(titleBoxTestId)).not.toBeInTheDocument();
				expect(screen.queryByText(fileItem.details.name)).not.toBeInTheDocument();
				expect(screen.queryByText('04 Aug 2023, 01:40 AM')).not.toBeInTheDocument();
				expect(screen.queryByLabelText('Warning')).not.toBeInTheDocument();

				// should not render error message
				expect(screen.queryByText('Failed to load')).not.toBeInTheDocument();

				// should render file type icon correctly
				expect(screen.queryByLabelText('media-type')).toBeInTheDocument();

				// should not render a spinner
				expect(screen.queryByTestId(spinnerTestId)).not.toBeInTheDocument();

				// should not render a progress bar
				expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
			});

			it('when there is an empty items error (emptyItems, metadata-fetch)', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(); // Intentionally skipping fileItem

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
							disableOverlay
						/>
					</MockedMediaClientProvider>,
				);

				// card should completely process the error
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'error',
					),
				);

				// should not render title box
				expect(screen.queryByTestId(titleBoxTestId)).not.toBeInTheDocument();
				expect(screen.queryByText(fileItem.details.name)).not.toBeInTheDocument();
				expect(screen.queryByText('04 Aug 2023, 01:40 AM')).not.toBeInTheDocument();
				expect(screen.queryByLabelText('Warning')).not.toBeInTheDocument();

				// should not render error message
				expect(screen.queryByText('Failed to load')).not.toBeInTheDocument();

				// should render file type icon correctly
				expect(screen.queryByLabelText('media-type')).toBeInTheDocument();

				// should not render a spinner
				expect(screen.queryByTestId(spinnerTestId)).not.toBeInTheDocument();

				// should not render a progress bar
				expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
			});

			it('when file id is invalid (invalidFileId, metadata-fetch)', async () => {
				const [fileItem, baseIdentifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);
				const identifier = { ...baseIdentifier, id: 'INVALID ID' };

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
							disableOverlay
						/>
					</MockedMediaClientProvider>,
				);

				// card should completely process the error
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'error',
					),
				);

				// should not render title box
				expect(screen.queryByTestId(titleBoxTestId)).not.toBeInTheDocument();
				expect(screen.queryByText(fileItem.details.name)).not.toBeInTheDocument();
				expect(screen.queryByText('04 Aug 2023, 01:40 AM')).not.toBeInTheDocument();
				expect(screen.queryByLabelText('Warning')).not.toBeInTheDocument();

				// should not render error message
				expect(screen.queryByText('Failed to load')).not.toBeInTheDocument();

				// should render file type icon correctly
				expect(screen.queryByLabelText('media-type')).toBeInTheDocument();

				// should not render a spinner
				expect(screen.queryByTestId(spinnerTestId)).not.toBeInTheDocument();

				// should not render a progress bar
				expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
			});

			it('when backend fails to process the file (status: failed-processing) ', async () => {
				const [fileItem, identifier] = generateSampleFileItem.failedPdf();
				const { mediaApi } = createMockedMediaApi(fileItem);

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
							disableOverlay
						/>
					</MockedMediaClientProvider>,
				);

				// card should completely process the error
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'failed-processing',
					),
				);

				// should not provide a download action
				expect(screen.queryByLabelText('Download')).not.toBeInTheDocument();

				// should not render title box
				expect(screen.queryByTestId(titleBoxTestId)).not.toBeInTheDocument();
				expect(screen.queryByText(fileItem.details.name)).not.toBeInTheDocument();
				expect(screen.queryByText('04 Aug 2023, 01:40 AM')).not.toBeInTheDocument();
				expect(screen.queryByLabelText('Warning')).not.toBeInTheDocument();

				// should render error message correctly
				expect(screen.queryByText('Preview unavailable')).toBeInTheDocument();

				// should render file type icon correctly
				expect(screen.queryByLabelText('pdf')).toBeInTheDocument();

				// should render a spinner
				expect(screen.queryByTestId(spinnerTestId)).not.toBeInTheDocument();

				// should not render a progress bar
				expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
			});

			it('when loading', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							disableOverlay
						/>
					</MockedMediaClientProvider>,
				);

				// should not render a title box
				expect(screen.queryByTestId(titleBoxTestId)).not.toBeInTheDocument();
				expect(screen.queryByText(fileItem.details.name)).not.toBeInTheDocument();
				expect(screen.queryByText('04 Aug 2023, 01:40 AM')).not.toBeInTheDocument();
				expect(screen.queryByLabelText('Warning')).not.toBeInTheDocument();

				// should not render a file type icon
				expect(screen.queryByLabelText('pdf')).not.toBeInTheDocument();

				// should render a spinner
				expect(screen.queryByTestId(spinnerTestId)).toBeInTheDocument();

				// should not render a progress bar
				expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
			});

			it('when backend is processing the file (status: processing)', async () => {
				const [fileItem, identifier] = generateSampleFileItem.processingPdf();
				const { mediaApi } = createMockedMediaApi(fileItem);

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
							disableOverlay
						/>
					</MockedMediaClientProvider>,
				);

				// card should be processing
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'processing',
					),
				);

				// should not render title box
				expect(screen.queryByTestId(titleBoxTestId)).not.toBeInTheDocument();
				expect(screen.queryByText(fileItem.details.name)).not.toBeInTheDocument();
				expect(screen.queryByText('24 Aug 2023, 05:11 AM')).not.toBeInTheDocument();

				// should render file type icon correctly
				expect(screen.queryByLabelText('pdf')).toBeInTheDocument();

				// should render message correctly
				expect(screen.queryByText('Creating preview...')).toBeInTheDocument();

				// should not render a spinner
				expect(screen.queryByTestId(spinnerTestId)).not.toBeInTheDocument();

				// should not render a progress bar
				expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
			});

			it('when uploading with a progress of 0', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { MockedMediaClientProvider, uploadItem } = createMockedMediaClientProvider({
					initialItems: fileItem,
				});

				uploadItem(fileItem, 0);

				render(
					<MockedMediaClientProvider>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
							disableOverlay
						/>
					</MockedMediaClientProvider>,
				);

				// card should be uploading
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'uploading',
					),
				);

				// should render an image
				expect(screen.queryByTestId(imgTestId)).toBeInTheDocument();

				// should not render title box
				expect(screen.queryByTestId(titleBoxTestId)).not.toBeInTheDocument();
				expect(screen.queryByText(fileItem.details.name)).not.toBeInTheDocument();
				expect(screen.queryByText('24 Aug 2023, 05:11 AM')).not.toBeInTheDocument();

				// should render file type icon correctly
				expect(screen.queryByLabelText('pdf')).toBeInTheDocument();

				// should not render a creating preview message
				expect(screen.queryByText('Creating preview...')).not.toBeInTheDocument();

				// should not render a spinner
				expect(screen.queryByTestId(spinnerTestId)).not.toBeInTheDocument();

				// should render a progress bar correctly
				expect(screen.queryByRole('progressbar')).toBeInTheDocument();
				expect(document.querySelector('[aria-valuenow="0"]')).toBeInTheDocument();
				expect(document.querySelector('[data-test-progress="0"]')).toBeInTheDocument();
			});

			it('when uploading with a progress of 0.5', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { MockedMediaClientProvider, uploadItem } = createMockedMediaClientProvider({
					initialItems: fileItem,
				});

				uploadItem(fileItem, 0.5);

				render(
					<MockedMediaClientProvider>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
							disableOverlay
						/>
					</MockedMediaClientProvider>,
				);

				// card should be uploading
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'uploading',
					),
				);

				// should render an image
				expect(screen.queryByTestId(imgTestId)).toBeInTheDocument();

				// should not render title box
				expect(screen.queryByTestId(titleBoxTestId)).not.toBeInTheDocument();
				expect(screen.queryByText(fileItem.details.name)).not.toBeInTheDocument();
				expect(screen.queryByText('24 Aug 2023, 05:11 AM')).not.toBeInTheDocument();

				// should render file type icon correctly
				expect(screen.queryByLabelText('pdf')).toBeInTheDocument();

				// should not render a creating preview message
				expect(screen.queryByText('Creating preview...')).not.toBeInTheDocument();

				// should not render a spinner
				expect(screen.queryByTestId(spinnerTestId)).not.toBeInTheDocument();

				// should render a progress bar correctly
				expect(screen.queryByRole('progressbar')).toBeInTheDocument();
				expect(document.querySelector('[aria-valuenow="50"]')).toBeInTheDocument();
				expect(document.querySelector('[data-test-progress="0.5"]')).toBeInTheDocument();
			});

			it('when successfully being processed after uploading without a local preview', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { MockedMediaClientProvider, uploadItem, processItem } =
					createMockedMediaClientProvider({
						initialItems: fileItem,
					});

				uploadItem(fileItem, 0.5);

				render(
					<MockedMediaClientProvider>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
							disableOverlay
						/>
					</MockedMediaClientProvider>,
				);

				// card should be attempting in uploading status
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'uploading',
					),
				);

				uploadItem(fileItem, 1);
				processItem(fileItem, 1);

				// simulate that the file has been fully loaded by the browser
				const img = await screen.findByTestId(imgTestId);
				await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());
				await simulateImageLoadDelay();
				fireEvent.load(img);

				// card should completely process the file
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'complete',
					),
				);

				// should not render title box
				expect(screen.queryByTestId(titleBoxTestId)).not.toBeInTheDocument();
				expect(screen.queryByText(fileItem.details.name)).not.toBeInTheDocument();
				expect(screen.queryByText('24 Aug 2023, 05:11 AM')).not.toBeInTheDocument();

				// should not render file type icon
				expect(screen.queryByLabelText('pdf')).not.toBeInTheDocument();

				// should not render a creating preview message
				expect(screen.queryByText('Creating preview...')).not.toBeInTheDocument();

				// should not render a spinner
				expect(screen.queryByTestId(spinnerTestId)).not.toBeInTheDocument();

				// should not render a progress bar correctly
				expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
				expect(document.querySelector('[data-test-progress="1"]')).toBeInTheDocument();
			});

			it('when uploading with a local preview', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
				const { MockedMediaClientProvider, uploadItem } = createMockedMediaClientProvider({
					initialItems: fileItem,
				});

				uploadItem(fileItem, 0.8);

				render(
					<MockedMediaClientProvider>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
							disableOverlay
						/>
					</MockedMediaClientProvider>,
				);

				// should render a preview img
				await screen.findByTestId(imgTestId);

				// should not render title box
				expect(screen.queryByTestId(titleBoxTestId)).not.toBeInTheDocument();
				expect(screen.queryByText(fileItem.details.name)).not.toBeInTheDocument();
				expect(screen.queryByText('24 Aug 2023, 05:11 AM')).not.toBeInTheDocument();

				// should render file type icon correctly
				// expect(screen.queryByLabelText('pdf')).toBeInTheDocument();

				// should not render a creating preview message
				expect(screen.queryByText('Creating preview...')).not.toBeInTheDocument();

				// should not render a spinner
				expect(screen.queryByTestId(spinnerTestId)).not.toBeInTheDocument();

				// should render a progress bar correctly
				expect(screen.queryByRole('progressbar')).toBeInTheDocument();
				expect(document.querySelector('[aria-valuenow="80"]')).toBeInTheDocument();
				expect(document.querySelector('[data-test-progress="0.8"]')).toBeInTheDocument();
			});

			it('when successfully being processed after uploading with a local preview', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
				const { MockedMediaClientProvider, uploadItem, processItem } =
					createMockedMediaClientProvider({
						initialItems: fileItem,
					});

				uploadItem(fileItem, 0.5);

				render(
					<MockedMediaClientProvider>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
							disableOverlay
						/>
					</MockedMediaClientProvider>,
				);

				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'uploading',
					),
				);

				uploadItem(fileItem, 1);
				processItem(fileItem, 1);

				// simulate that the file has been fully loaded by the browser
				const img = await screen.findByTestId(imgTestId);
				await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());
				await simulateImageLoadDelay();
				fireEvent.load(img);

				// card should completely process the file
				await waitFor(
					() => expect(document.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
					{ timeout: 10000 },
				);

				// should render a preview img
				expect(screen.queryByTestId(imgTestId)).toBeInTheDocument();

				// should not render title box
				expect(screen.queryByTestId(titleBoxTestId)).not.toBeInTheDocument();
				expect(screen.queryByText(fileItem.details.name)).not.toBeInTheDocument();
				expect(screen.queryByText('24 Aug 2023, 05:11 AM')).not.toBeInTheDocument();

				// should render file type icon correctly
				// expect(screen.queryByLabelText('pdf')).toBeInTheDocument();

				// should not render a creating preview message
				expect(screen.queryByText('Creating preview...')).not.toBeInTheDocument();

				// should not render a spinner
				expect(screen.queryByTestId(spinnerTestId)).not.toBeInTheDocument();

				// should not render a progress bar correctly
				expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
				expect(document.querySelector('[data-test-progress="1"]')).toBeInTheDocument();
			});

			it('when the card is never loaded', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				// Skipping the file item intentionally
				const { mediaApi } = createMockedMediaApi();

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							disableOverlay
						/>
					</MockedMediaClientProvider>,
				);

				// should always render image
				expect(await screen.findByTestId(imgTestId)).toBeInTheDocument();

				// should not render a title box
				expect(screen.queryByTestId(titleBoxTestId)).not.toBeInTheDocument();
				expect(screen.queryByText(fileItem.details.name)).not.toBeInTheDocument();
				expect(screen.queryByText('24 Aug 2023, 05:11 AM')).not.toBeInTheDocument();

				// should not render a file type icon
				expect(screen.queryByLabelText('pdf')).not.toBeInTheDocument();

				// should not render a creating preview message
				expect(screen.queryByText('Creating preview...')).not.toBeInTheDocument();

				// should render a spinner
				expect(screen.queryByTestId(spinnerTestId)).toBeInTheDocument();

				// should not render a progress bar
				expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
			});

			it('when there is an upload error', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { MockedMediaClientProvider, uploadItem } = createMockedMediaClientProvider({
					initialItems: fileItem,
				});

				uploadItem(fileItem, 0.5);

				render(
					<MockedMediaClientProvider>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
							disableOverlay
						/>
					</MockedMediaClientProvider>,
				);

				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'uploading',
					),
				);

				uploadItem(fileItem, 'error');

				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'error',
					),
				);

				// should not render title box
				expect(screen.queryByTestId(titleBoxTestId)).not.toBeInTheDocument();
				expect(screen.queryByText(fileItem.details.name)).not.toBeInTheDocument();
				expect(screen.queryByText('04 Aug 2023, 01:40 AM')).not.toBeInTheDocument();

				expect(screen.queryByText('Failed to upload')).toBeInTheDocument();

				// should render file type icon correctly
				expect(screen.queryByLabelText('pdf')).toBeInTheDocument();

				// should not render a spinner
				expect(screen.queryByTestId(spinnerTestId)).not.toBeInTheDocument();

				// should not render a progress bar
				expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
			});

			// TODO: Fix when the Mocked Media API is updated from https://product-fabric.atlassian.net/browse/MEX-2642
			// TODO: This case is not techinally feasible
			it.skip('when an error occurs after the card is complete', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
							disableOverlay
						/>
					</MockedMediaClientProvider>,
				);

				// simulate that the file has been fully loaded by the browser
				const img = await screen.findByTestId(imgTestId);

				await simulateImageLoadDelay();
				fireEvent.load(img);

				// card should completely process the file
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'complete',
					),
				);

				//act(() => {
				// TODO: Fix when the Mocked Media API is updated from https://product-fabric.atlassian.net/browse/MEX-2642
				// mediaClient.__DO_NOT_USE__getMediaStore().setState((state) => {
				//   state.files[fileItem.id] = {
				//     status: 'error',
				//     id: fileItem.id,
				//     reason: 'some error reason',
				//     details: {},
				//   };
				// });
				// });

				// card should ignore the error
				expect(await screen.findByTestId('media-file-card-view')).not.toHaveAttribute(
					'data-test-status',
					'error',
				);

				// should not render title box
				expect(screen.queryByTestId(titleBoxTestId)).toBeInTheDocument();
				expect(screen.queryByText(fileItem.details.name)).not.toBeInTheDocument();
				expect(screen.queryByText('04 Aug 2023, 01:40 AM')).not.toBeInTheDocument();
				expect(screen.queryByLabelText('Warning')).not.toBeInTheDocument();

				// should not render an error message
				expect(screen.queryByText('Failed to load')).not.toBeInTheDocument();

				// should not render a spinner
				expect(screen.queryByTestId(spinnerTestId)).not.toBeInTheDocument();

				// should not render a progress bar
				expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
			});
		});
	});

	describe('should manage inline player', () => {
		it('should render a video player when a video is clicked upon', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingVideo();
			const { mediaApi } = createMockedMediaApi(fileItem);

			const user = userEvent.setup();
			const onClick = jest.fn();
			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
						onClick={onClick}
						useInlinePlayer
					/>
				</MockedMediaClientProvider>,
			);

			// simulate that the file has been fully loaded by the browser
			const img = await screen.findByTestId(imgTestId, undefined);
			await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());
			await simulateImageLoadDelay();
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'complete',
				),
			);

			const playBtn = screen.getByLabelText('play');
			await user.click(playBtn);
			await waitFor(() => expect(document.querySelector('video')).toBeInTheDocument());
		});

		it('should not render an inline video when an error occurs', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingVideo();
			const { mediaApi } = createMockedMediaApi(fileItem);

			mediaApi.getFileBinaryURL = async () => {
				throw new Error();
			};
			mediaApi.getArtifactURL = async () => {
				throw new Error();
			};

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
						useInlinePlayer
						disableOverlay
					/>
				</MockedMediaClientProvider>,
			);

			// card should completely process the error
			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'error',
				),
			);

			expect(screen.queryByLabelText('play')).not.toBeInTheDocument();
			expect(screen.queryByRole('video')).not.toBeInTheDocument();
		});

		it('should render preview unavailable when video is failed processing and inline player enabled', async () => {
			const [fileItem, identifier] = generateSampleFileItem.failedVideo();
			const { mediaApi } = createMockedMediaApi(fileItem);

			const original = mediaApi.getItems;

			let resolveItems = () => {};

			mediaApi.getItems = jest.fn(async (...args) => {
				await new Promise<void>((res) => {
					resolveItems = res;
				});
				return original(...args);
			});

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						disableOverlay
						useInlinePlayer
						appearance="auto"
						isLazy={false}
					/>
				</MockedMediaClientProvider>,
			);

			await waitFor(() => {
				expect(mediaApi.getItems).toHaveBeenCalled();
			});

			act(() => {
				resolveItems();
			});

			// simulate that the file has been fully loaded by the browser
			const PreviewUnavailable = await screen.findByText('Preview unavailable', undefined);
			expect(PreviewUnavailable).toBeInTheDocument();

			expect(screen.queryByTestId(spinnerTestId, undefined)).not.toBeInTheDocument();
		});
	});

	describe('should update when a new identifier is provided', () => {
		it('for a new file identifier', async () => {
			global.URL.createObjectURL = () => 'create-object-url-1';

			const [fileItem1, identifier1] = generateSampleFileItem.workingPdfWithRemotePreview();
			const [fileItem2, identifier2] = generateSampleFileItem.workingJpegWithRemotePreview();
			const { mediaApi } = createMockedMediaApi([fileItem1, fileItem2]);

			const { rerender } = render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier1}
						isLazy={false}
					/>
				</MockedMediaClientProvider>,
			);

			// simulate that the file has been fully loaded by the browser
			const img = await screen.findByTestId(imgTestId, undefined);
			await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());
			await simulateImageLoadDelay();
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'complete',
				),
			);

			expect((img as HTMLImageElement).src).toContain('create-object-url-1');
			expect(screen.queryByText(fileItem1.details.name)).toBeInTheDocument();
			expect(screen.queryByText('04 Aug 2023, 01:40 AM')).toBeInTheDocument();

			global.URL.createObjectURL = () => 'create-object-url-2';

			rerender(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier2}
						isLazy={false}
					/>
				</MockedMediaClientProvider>,
			);

			// simulate that the file has been fully loaded by the browser
			const newImg = await screen.findByTestId(imgTestId);
			await waitFor(() => expect(newImg.getAttribute('src')).toBeTruthy());

			fireEvent.load(newImg);

			// card should completely process the file
			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'complete',
				),
			);

			expect((newImg as HTMLImageElement).src).toContain('create-object-url-2');
			expect(await screen.findByText(fileItem2.details.name)).toBeInTheDocument();
			expect(screen.queryByText('11 Jan 2017, 04:48 AM')).toBeInTheDocument();

			// reset createObjectURL
			global.URL.createObjectURL = () => 'mock result of URL.createObjectURL()';
		});

		it('for a new external image identifier', async () => {
			const { mediaApi } = createMockedMediaApi();
			const extIdentifier = {
				mediaItemType: 'external-image',
				dataURI: 'ext-uri',
				name: 'ext',
			} as const;
			const { rerender } = render(
				// Strictly speaking, the Mocked Provider is not required for this test, but we added to make sure it doesn't add noise
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={extIdentifier}
						isLazy={false}
					/>
				</MockedMediaClientProvider>,
			);

			// simulate that the file has been fully loaded by the browser
			const img = await screen.findByTestId(imgTestId, undefined);
			await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());
			await simulateImageLoadDelay();
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'complete',
				),
			);

			expect(screen.getByText(extIdentifier.name)).toBeInTheDocument();
			expect((img as HTMLImageElement).src).toContain(extIdentifier.dataURI);

			const newExtIdentifier = {
				mediaItemType: 'external-image',
				dataURI: 'new-ext-uri',
				name: 'nExt',
			} as const;

			rerender(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={newExtIdentifier}
						isLazy={false}
					/>
				</MockedMediaClientProvider>,
			);

			// simulate that the file has been fully loaded by the browser
			const newImg = await screen.findByTestId(imgTestId);
			await waitFor(() => expect(newImg.getAttribute('src')).toBeTruthy());

			fireEvent.load(newImg);

			// card should completely process the file
			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'complete',
				),
			);

			expect(screen.getByText(newExtIdentifier.name)).toBeInTheDocument();
			expect((newImg as HTMLImageElement).src).toContain(newExtIdentifier.dataURI);
		});
	});

	it('should trigger download action successfully when clicked', async () => {
		const [fileItem, identifier] = generateSampleFileItem.failedPdf();
		const { mediaApi } = createMockedMediaApi(fileItem);

		const binaryUrl = 'binary-url';
		const getFileBinaryURL = jest.spyOn(mediaApi, 'getFileBinaryURL').mockResolvedValue(binaryUrl);
		const testUrl = jest.spyOn(mediaApi, 'testUrl');

		const user = userEvent.setup();

		render(
			<MockedMediaClientProvider mockedMediaApi={mediaApi}>
				<CardLoader
					mediaClientConfig={dummyMediaClientConfig}
					identifier={identifier}
					isLazy={false}
				/>
			</MockedMediaClientProvider>,
		);

		// card should completely process the error
		await waitFor(async () =>
			expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
				'data-test-status',
				'failed-processing',
			),
		);

		const btn = screen.getByLabelText('Download');
		await user.click(btn);

		expect(getFileBinaryURL).toHaveBeenCalledWith(fileItem.id, fileItem.collection);
		expect(testUrl).toHaveBeenCalledWith(binaryUrl, {
			traceContext: { traceId: expect.any(String) },
		});

		expect(globalMediaEventEmitter.emit).toHaveBeenCalledTimes(1);
		expect(globalMediaEventEmitter.emit).toHaveBeenCalledWith('media-viewed', {
			fileId: fileItem.id,
			isUserCollection: false,
			viewingLevel: 'download',
		});

		expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith({
			eventType: 'operational',
			action: 'succeeded',
			actionSubject: 'mediaCardDownload',
			attributes: {
				fileMimetype: fileItem.details.mimeType,
				status: 'success',
				fileAttributes: {
					fileMediatype: fileItem.details.mediaType,
					fileMimetype: fileItem.details.mimeType,
					fileId: fileItem.id,
					fileSize: fileItem.details.size,
					fileStatus: 'failed-processing',
				},
				metadataTraceContext: {
					spanId: expect.any(String),
					traceId: expect.any(String),
				},
				traceContext: {
					traceId: expect.any(String),
				},
			},
		});
	});

	it('should attach download action when shouldEnableDownloadButton is passed', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
		const { mediaApi } = createMockedMediaApi(fileItem);

		const binaryUrl = 'binary-url';
		const getFileBinaryURL = jest.spyOn(mediaApi, 'getFileBinaryURL').mockResolvedValue(binaryUrl);
		const testUrl = jest.spyOn(mediaApi, 'testUrl');

		const user = userEvent.setup();

		render(
			<MockedMediaClientProvider mockedMediaApi={mediaApi}>
				<CardLoader
					mediaClientConfig={dummyMediaClientConfig}
					identifier={identifier}
					isLazy={false}
					shouldEnableDownloadButton
				/>
			</MockedMediaClientProvider>,
		);

		const btn = await screen.findByLabelText('Download');
		await user.click(btn);

		expect(getFileBinaryURL).toHaveBeenCalledWith(fileItem.id, fileItem.collection);
		expect(testUrl).toHaveBeenCalledWith(binaryUrl, {
			traceContext: { traceId: expect.any(String) },
		});

		expect(globalMediaEventEmitter.emit).toHaveBeenCalledTimes(1);
		expect(globalMediaEventEmitter.emit).toHaveBeenCalledWith('media-viewed', {
			fileId: fileItem.id,
			isUserCollection: false,
			viewingLevel: 'download',
		});

		expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith({
			eventType: 'operational',
			action: 'succeeded',
			actionSubject: 'mediaCardDownload',
			attributes: {
				fileMimetype: fileItem.details.mimeType,
				status: 'success',
				fileAttributes: {
					fileMediatype: fileItem.details.mediaType,
					fileMimetype: fileItem.details.mimeType,
					fileId: fileItem.id,
					fileSize: fileItem.details.size,
					fileStatus: 'processed',
				},
				metadataTraceContext: {
					spanId: expect.any(String),
					traceId: expect.any(String),
				},
				traceContext: {
					traceId: expect.any(String),
				},
			},
		});
	});

	it('should block downloads when DSP is enabled', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
		const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
			initialItems: fileItem,
			mediaClientConfig: { enforceDataSecurityPolicy: true },
		});

		const binaryUrl = 'binary-url';
		const getFileBinaryURL = jest.spyOn(mediaApi, 'getFileBinaryURL').mockResolvedValue(binaryUrl);
		const testUrl = jest.spyOn(mediaApi, 'testUrl');

		const user = userEvent.setup();

		render(
			<MockedMediaClientProvider>
				<CardLoader
					mediaClientConfig={dummyMediaClientConfig}
					identifier={identifier}
					isLazy={false}
					shouldEnableDownloadButton
				/>
			</MockedMediaClientProvider>,
		);

		const btn = await screen.findByLabelText('Download');
		await user.click(btn);

		expect(getFileBinaryURL).not.toHaveBeenCalled();
		expect(testUrl).not.toHaveBeenCalled();
		expect(globalMediaEventEmitter.emit).not.toHaveBeenCalled();

		expect(mockCreateAnalyticsEvent).not.toHaveBeenCalledWith(
			expect.objectContaining({
				actionSubject: 'mediaCardDownload',
				attributes: expect.objectContaining({ status: 'success' }),
			}),
		);
	});

	it('should log failed download action', async () => {
		const [fileItem, identifier] = generateSampleFileItem.failedPdf();
		const { mediaApi } = createMockedMediaApi(fileItem);

		const binaryUrl = 'binary-url';
		const getFileBinaryURL = jest.spyOn(mediaApi, 'getFileBinaryURL').mockResolvedValue(binaryUrl);
		const testUrl = jest
			.spyOn(mediaApi, 'testUrl')
			.mockRejectedValue(createServerUnauthorizedError());

		const user = userEvent.setup();

		render(
			<MockedMediaClientProvider mockedMediaApi={mediaApi}>
				<CardLoader
					mediaClientConfig={dummyMediaClientConfig}
					identifier={identifier}
					isLazy={false}
				/>
			</MockedMediaClientProvider>,
		);

		// card should completely process the error
		await waitFor(async () =>
			expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
				'data-test-status',
				'failed-processing',
			),
		);

		const btn = screen.getByLabelText('Download');
		await user.click(btn);

		expect(getFileBinaryURL).toHaveBeenCalledWith(fileItem.id, fileItem.collection);
		expect(testUrl).toHaveBeenCalledWith(binaryUrl, {
			traceContext: { traceId: expect.any(String) },
		});

		expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith({
			eventType: 'operational',
			action: 'failed',
			actionSubject: 'mediaCardDownload',
			attributes: {
				error: 'serverUnauthorized',
				errorDetail: 'serverUnauthorized',
				failReason: 'download',
				fileMimetype: fileItem.details.mimeType,
				status: 'fail',
				fileAttributes: {
					fileMediatype: fileItem.details.mediaType,
					fileMimetype: fileItem.details.mimeType,
					fileId: fileItem.id,
					fileSize: fileItem.details.size,
					fileStatus: 'failed-processing',
				},
				metadataTraceContext: {
					spanId: expect.any(String),
					traceId: expect.any(String),
				},
				traceContext: {
					traceId: expect.any(String),
				},
				request: {
					attempts: 5,
					clientExhaustedRetries: true,
					mediaEnv: 'test-media-env',
					mediaRegion: 'test-media-region',
					statusCode: 403,
					traceContext: {
						spanId: expect.any(String),
						traceId: expect.any(String),
					},
				},
			},
		});
	});

	it('should display a warning message when the downloading file is marked as abusive', async () => {
		const [fileItem, identifier] = generateSampleFileItem.abuseImage();
		const { mediaApi } = createMockedMediaApi(fileItem);

		const binaryUrl = 'binary-url';
		const getFileBinaryURL = jest.spyOn(mediaApi, 'getFileBinaryURL').mockResolvedValue(binaryUrl);
		const testUrl = jest.spyOn(mediaApi, 'testUrl');

		const user = userEvent.setup();

		render(
			<MockedMediaClientProvider mockedMediaApi={mediaApi}>
				<CardLoader
					mediaClientConfig={dummyMediaClientConfig}
					identifier={identifier}
					isLazy={false}
					shouldEnableDownloadButton
				/>
			</MockedMediaClientProvider>,
		);

		const btn = await screen.findByLabelText('Download');
		await user.click(btn);

		const warningMsg = await screen.findByTestId('mediaAbuseModal');
		expect(warningMsg).toBeInTheDocument();

		const proceed = await screen.findByText('Proceed with download');
		await user.click(proceed);

		expect(getFileBinaryURL).toHaveBeenCalledWith(fileItem.id, fileItem.collection);
		expect(testUrl).toHaveBeenCalledWith(binaryUrl, {
			traceContext: { traceId: expect.any(String) },
		});

		expect(globalMediaEventEmitter.emit).toHaveBeenCalledTimes(2);
		expect(globalMediaEventEmitter.emit).toHaveBeenCalledWith('media-viewed', {
			fileId: fileItem.id,
			isUserCollection: false,
			viewingLevel: 'minimal',
		});
		expect(globalMediaEventEmitter.emit).toHaveBeenCalledWith('media-viewed', {
			fileId: fileItem.id,
			isUserCollection: false,
			viewingLevel: 'download',
		});

		expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith({
			eventType: 'operational',
			action: 'succeeded',
			actionSubject: 'mediaCardDownload',
			attributes: {
				fileMimetype: fileItem.details.mimeType,
				status: 'success',
				fileAttributes: {
					fileMediatype: fileItem.details.mediaType,
					fileMimetype: fileItem.details.mimeType,
					fileId: fileItem.id,
					fileSize: fileItem.details.size,
					fileStatus: 'processed',
				},
				metadataTraceContext: {
					spanId: expect.any(String),
					traceId: expect.any(String),
				},
				traceContext: {
					traceId: expect.any(String),
				},
			},
		});
	});

	it('should not download when cancelling from the abuse warning message', async () => {
		const [fileItem, identifier] = generateSampleFileItem.abuseSvg();
		const { mediaApi } = createMockedMediaApi(fileItem);

		const binaryUrl = 'binary-url';
		const getFileBinaryURL = jest.spyOn(mediaApi, 'getFileBinaryURL').mockResolvedValue(binaryUrl);
		const testUrl = jest.spyOn(mediaApi, 'testUrl');

		const user = userEvent.setup();

		render(
			<MockedMediaClientProvider mockedMediaApi={mediaApi}>
				<CardLoader
					mediaClientConfig={dummyMediaClientConfig}
					identifier={identifier}
					isLazy={false}
					shouldEnableDownloadButton
				/>
			</MockedMediaClientProvider>,
		);

		const btn = await screen.findByLabelText('Download');
		await user.click(btn);

		const warningMsg = await screen.findByTestId('mediaAbuseModal');
		expect(warningMsg).toBeInTheDocument();

		const cancel = await screen.findByText('Cancel');
		await user.click(cancel);

		expect(getFileBinaryURL).not.toHaveBeenCalled();
		expect(testUrl).not.toHaveBeenCalled();
		expect(globalMediaEventEmitter.emit).toHaveBeenCalledTimes(1);
		expect(globalMediaEventEmitter.emit).toHaveBeenCalledWith('media-viewed', {
			fileId: fileItem.id,
			isUserCollection: false,
			viewingLevel: 'minimal',
		});

		expect(mockCreateAnalyticsEvent).not.toHaveBeenCalledWith(
			expect.objectContaining({
				actionSubject: 'mediaCardDownload',
				attributes: expect.objectContaining({ status: 'success' }),
			}),
		);
	});

	describe('should manage MediaViewer integration', () => {
		it('should render Media Viewer when clicked when "shouldOpenMediaViewer" is true', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			const user = userEvent.setup();

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
						shouldOpenMediaViewer
					/>
				</MockedMediaClientProvider>,
			);

			// card should be attempting to load the preview
			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'loading-preview',
				),
			);

			// simulate that the file has been fully loaded by the browser
			const img = await screen.findByTestId(imgTestId);
			await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());

			await simulateImageLoadDelay();
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'complete',
				),
			);

			const card = screen.getByTestId(cardTestId);
			await user.click(card);
			expect(await screen.findByTestId(mediaViewerTestId)).toBeInTheDocument();
		});

		it('should not render Media Viewer when clicked when "shouldOpenMediaViewer" is false by default', async () => {
			const user = userEvent.setup();
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
					/>
				</MockedMediaClientProvider>,
			);

			// simulate that the file has been fully loaded by the browser
			const img = await screen.findByTestId(imgTestId);
			await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());

			await simulateImageLoadDelay();
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'complete',
				),
			);

			const card = screen.getByTestId(cardTestId);
			await user.click(card);
			await expect(screen.findByTestId(mediaViewerTestId)).rejects.toThrow();
		});

		it('should render Media Viewer with an item', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			const user = userEvent.setup();

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
						shouldOpenMediaViewer
					/>
				</MockedMediaClientProvider>,
			);

			// simulate that the file has been fully loaded by the browser
			const img = await screen.findByTestId(imgTestId);
			await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());

			await simulateImageLoadDelay();
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'complete',
				),
			);

			const card = screen.getByTestId(cardTestId);
			await user.click(card);

			const mediaViewer = await screen.findByTestId(mediaViewerTestId);
			expect(mediaViewer).toBeInTheDocument();

			expect(await within(mediaViewer).findByText(fileItem.details.name)).toBeInTheDocument();
		});

		it('should open the media viewer when button is clicked and focus button when closed', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			const user = userEvent.setup();

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
						shouldOpenMediaViewer
					/>
				</MockedMediaClientProvider>,
			);

			// simulate that the file has been fully loaded by the browser
			const img = await screen.findByTestId(imgTestId);
			await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());

			await simulateImageLoadDelay();
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'complete',
				),
			);

			const openButton = screen.getByText('Open name.pdf');
			await user.tab();
			expect(openButton).toHaveFocus();
			await user.keyboard('{Enter}');

			const mediaViewer = await screen.findByTestId(mediaViewerTestId);
			expect(mediaViewer).toBeInTheDocument();
			expect(openButton).not.toHaveFocus();

			const closeButton = screen.getByLabelText('Close');
			expect(closeButton).toBeInTheDocument();
			await user.click(closeButton);

			expect(mediaViewer).not.toBeInTheDocument();
			expect(openButton).toHaveFocus();
		});

		it('should not render Media Viewer for a video when "useInlinePlayer" is true', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingVideo();
			const { mediaApi } = createMockedMediaApi(fileItem);

			const user = userEvent.setup();
			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
						shouldOpenMediaViewer
						useInlinePlayer
					/>
				</MockedMediaClientProvider>,
			);

			// simulate that the file has been fully loaded by the browser
			const img = await screen.findByTestId(imgTestId);
			await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());

			await simulateImageLoadDelay();
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'complete',
				),
			);

			const card = screen.getByTestId(cardTestId);
			await user.click(card);
			await expect(screen.findByTestId(mediaViewerTestId)).rejects.toThrow();
		});
	});

	it('should render correctly with an external image identifier', async () => {
		const { mediaApi } = createMockedMediaApi();
		const extIdentifier = {
			mediaItemType: 'external-image',
			dataURI: 'ext-uri',
			name: 'ext',
		} as const;

		render(
			<MockedMediaClientProvider mockedMediaApi={mediaApi}>
				<CardLoader
					mediaClientConfig={dummyMediaClientConfig}
					identifier={extIdentifier}
					isLazy={false}
				/>
			</MockedMediaClientProvider>,
		);

		// simulate that the file has been fully loaded by the browser
		const img = await screen.findByTestId(imgTestId);
		await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());

		await simulateImageLoadDelay();
		fireEvent.load(img);

		// card should completely process the file
		await waitFor(async () =>
			expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
				'data-test-status',
				'complete',
			),
		);

		expect(screen.getByText(extIdentifier.name)).toBeInTheDocument();
		expect((img as HTMLImageElement).src).toContain(extIdentifier.dataURI);
	});

	describe('should trigger events from globalMediaEventEmitter', () => {
		it('when rendering an image not from the recents collection, it should emit a "media-viewed" event', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
					/>
				</MockedMediaClientProvider>,
			);

			// simulate that the file has been fully loaded by the browser
			const img = await screen.findByTestId(imgTestId);
			await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());

			await simulateImageLoadDelay();
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'complete',
				),
			);

			expect(globalMediaEventEmitter.emit).toHaveBeenCalledTimes(1);
			expect(globalMediaEventEmitter.emit).toHaveBeenCalledWith('media-viewed', {
				fileId: fileItem.id,
				isUserCollection: false,
				viewingLevel: 'minimal',
			});
		});

		it('when rendering an image from the recents collection, it should emit a "media-viewed" event', async () => {
			const [fileItem, identifier] =
				generateSampleFileItem.workingImgWithRemotePreviewInRecentsCollection();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
					/>
				</MockedMediaClientProvider>,
			);

			// simulate that the file has been fully loaded by the browser
			const img = await screen.findByTestId(imgTestId);
			await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());

			await simulateImageLoadDelay();
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'complete',
				),
			);

			expect(globalMediaEventEmitter.emit).toHaveBeenCalledTimes(1);
			expect(globalMediaEventEmitter.emit).toHaveBeenCalledWith('media-viewed', {
				fileId: fileItem.id,
				isUserCollection: true,
				viewingLevel: 'minimal',
			});
		});

		it('when rendering an external image, it should emit a "media-viewed" event', async () => {
			const { mediaApi } = createMockedMediaApi();
			const identifier = {
				mediaItemType: 'external-image',
				dataURI: 'ext-uri',
				name: 'ext',
			} as const;
			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
					/>
				</MockedMediaClientProvider>,
			);

			// simulate that the file has been fully loaded by the browser
			const img = await screen.findByTestId(imgTestId);
			await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());

			await simulateImageLoadDelay();
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'complete',
				),
			);

			expect(globalMediaEventEmitter.emit).toHaveBeenCalledTimes(1);
			expect(globalMediaEventEmitter.emit).toHaveBeenCalledWith('media-viewed', {
				fileId: identifier.dataURI,
				isUserCollection: false,
				viewingLevel: 'minimal',
			});
		});
	});

	it('should internationalise messages with the provided IntlProvider', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
		const { mediaApi } = createMockedMediaApi(fileItem);

		mediaApi.getImage = async () => {
			throw new Error('remote-preview-fetch');
		};

		render(
			<MockedMediaClientProvider mockedMediaApi={mediaApi}>
				<IntlProvider
					locale="en"
					messages={{
						'fabric.media.preview_unavailable': 'an internationalised message',
					}}
				>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
					/>
				</IntlProvider>
			</MockedMediaClientProvider>,
		);

		// card should completely process the error
		await waitFor(async () =>
			expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
				'data-test-status',
				'error',
			),
		);

		expect(screen.getByText('an internationalised message')).toBeInTheDocument();
	});

	it('should forward includeHashForDuplicateFiles to getItems when provided', async () => {
		const [fileItem, identifier] = generateSampleFileItem.failedVideo();
		const { mediaApi } = createMockedMediaApi(fileItem);

		const original = mediaApi.getItems;

		mediaApi.getItems = jest.fn(async (...args) => {
			return original(...args);
		});

		render(
			<MockedMediaClientProvider mockedMediaApi={mediaApi}>
				<CardLoader
					mediaClientConfig={dummyMediaClientConfig}
					identifier={identifier}
					disableOverlay
					useInlinePlayer
					appearance="auto"
					isLazy={false}
					includeHashForDuplicateFiles
				/>
			</MockedMediaClientProvider>,
		);

		await waitFor(() => {
			expect(mediaApi.getItems).toHaveBeenCalled();
		});

		expect(mediaApi.getItems).toHaveBeenCalledWith(
			[identifier.id],
			identifier.collectionName,
			{
				spanId: expect.anything(),
				traceId: expect.anything(),
			},
			true,
		);
	});

	ffTest.on('platform_media_cross_client_copy', 'copy intent', () => {
		it('should call copy intent', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			const user = userEvent.setup();

			mediaApi.registerCopyIntents = jest.fn(async () => {});

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<div>from here</div>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						appearance="auto"
						isLazy={false}
					/>
					<div>to here</div>
				</MockedMediaClientProvider>,
			);

			// simulate that the file has been fully loaded by the browser
			const img = await screen.findByTestId(imgTestId);
			await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());
			await simulateImageLoadDelay();
			fireEvent.load(img);

			// card should completely process the file
			expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
				'data-test-status',
				'complete',
			);

			await user.pointer({
				keys: '[MouseLeft][MouseLeft>]',
				target: screen.getByText('from here'),
				offset: 0,
			});

			await user.pointer({
				target: screen.getByText('to here'),
			});

			await user.copy();

			expect(mediaApi.registerCopyIntents).toHaveBeenCalledTimes(1);
			expect(mediaApi.registerCopyIntents).toHaveBeenCalledWith(
				[{ id: identifier.id, collection: identifier.collectionName }],
				{ spanId: expect.any(String), traceId: expect.any(String) },
				expect.any(Object),
			);
		});
	});

	describe('should manage analytics appropriately', () => {
		describe('should pass the Analytics Event fired', () => {
			it('from CardView to the provided onClick callback', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);

				const user = userEvent.setup();
				const onClick = jest.fn();
				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
							onClick={onClick}
						/>
					</MockedMediaClientProvider>,
				);

				// simulate that the file has been fully loaded by the browser
				const img = await screen.findByTestId(imgTestId);
				await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());
				await simulateImageLoadDelay();
				fireEvent.load(img);

				// card should completely process the file
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'complete',
				);

				const card = screen.getByTestId(cardTestId);
				await user.click(card);
				expect(onClick.mock.calls[0][1]).toBeDefined();
			});

			it('from InlinePlayerLazy to the provided onClick callback', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingVideo();
				const { mediaApi } = createMockedMediaApi(fileItem);

				const user = userEvent.setup();
				const onClick = jest.fn();
				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
							onClick={onClick}
							useInlinePlayer
						/>
					</MockedMediaClientProvider>,
				);

				// simulate that the file has been fully loaded by the browser
				const img = await screen.findByTestId(imgTestId);
				await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());
				await simulateImageLoadDelay();
				fireEvent.load(img);

				// card should completely process the file
				await waitFor(() =>
					expect(screen.getByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'complete',
					),
				);

				const card = screen.getByTestId(cardTestId);
				await user.click(card);
				expect(onClick.mock.calls[0][1]).toBeDefined();
			});
		});

		describe('should attach the correct file status flags when completing the UFO experience', () => {
			it('should attach an uploading file status flag with value as true', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { uploadItem, processItem, MockedMediaClientProvider } =
					createMockedMediaClientProvider({
						initialItems: fileItem,
					});

				uploadItem(fileItem, 0);

				render(
					<MockedMediaClientProvider>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'uploading',
					),
				);

				uploadItem(fileItem, 1);
				processItem(fileItem, 1);

				// simulate that the file has been fully loaded by the browser
				const img = await screen.findByTestId(imgTestId, undefined);
				await waitFor(async () => expect(img.getAttribute('src')).toBeTruthy());
				await simulateImageLoadDelay();
				fireEvent.load(img);

				// card should completely process the file
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'complete',
					),
				);

				expect(completeUfoExperience).toHaveBeenLastCalledWith(
					expect.any(String),
					expect.any(String),
					expect.any(Object),
					{ wasStatusUploading: true, wasStatusProcessing: true },
					expect.any(Object),
					undefined,
				);
			});

			it('should attach a processing file status flag with value as true', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { processItem, MockedMediaClientProvider } = createMockedMediaClientProvider({
					initialItems: fileItem,
				});

				processItem(fileItem, 0);

				render(
					<MockedMediaClientProvider>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				await waitFor(() => expect(() => screen.getByTestId('media-card-loading')).toThrow());

				// card should be attempting to loading the file state
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'processing',
					),
				);

				processItem(fileItem, 1);

				// simulate that the file has been fully loaded by the browser
				const img = await screen.findByTestId(imgTestId, undefined);
				await waitFor(() => expect(img.getAttribute('src')).toBeTruthy(), { timeout: 5_000 });
				await simulateImageLoadDelay();
				fireEvent.load(img);

				// card should completely process the file
				await waitFor(
					async () =>
						expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
							'data-test-status',
							'complete',
						),
					{ timeout: 5_000 },
				);

				expect(completeUfoExperience).toHaveBeenCalledTimes(3);
				expect(completeUfoExperience).toHaveBeenLastCalledWith(
					expect.any(String),
					expect.any(String),
					expect.any(Object),
					{ wasStatusUploading: false, wasStatusProcessing: true },
					expect.any(Object),
					undefined,
				);
			});

			it('should attach uploading and processing file status flags with values as false', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// simulate that the file has been fully loaded by the browser
				const img = await screen.findByTestId(imgTestId);
				await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());

				await simulateImageLoadDelay();
				fireEvent.load(img);

				// card should completely process the file
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'complete',
					),
				);
				expect(completeUfoExperience).toHaveBeenCalledTimes(2);
				expect(completeUfoExperience).toHaveBeenLastCalledWith(
					expect.any(String),
					expect.any(String),
					expect.any(Object),
					{ wasStatusUploading: false, wasStatusProcessing: false },
					expect.any(Object),
					undefined,
				);
			});

			it('should attach uploading and processing file status flags with values as false for external image identifiers', async () => {
				const { mediaApi } = createMockedMediaApi();
				const extIdentifier = {
					mediaItemType: 'external-image',
					dataURI: 'ext-uri',
					name: 'ext',
				} as const;
				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={extIdentifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// simulate that the file has been fully loaded by the browser
				const img = await screen.findByTestId(imgTestId);
				await waitFor(async () => expect(img.getAttribute('src')).toBeTruthy());

				await simulateImageLoadDelay();
				fireEvent.load(img);

				// card should completely process the file
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'complete',
					),
				);
				expect(completeUfoExperience).toHaveBeenCalledTimes(1);
				expect(completeUfoExperience).toHaveBeenLastCalledWith(
					expect.any(String),
					expect.any(String),
					expect.any(Object),
					{ wasStatusUploading: false, wasStatusProcessing: false },
					expect.any(Object),
					undefined,
				);
			});
		});

		describe('should complete the UFO experience correctly when experiencing errors', () => {
			it('when a serverRateLimited error occurs (RequestError: serverRateLimited)', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);

				mediaApi.getItems = () => {
					throw createRateLimitedError();
				};

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// card should completely process the error
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'error',
					),
				);

				await waitFor(() => {
					expect(completeUfoExperience).toHaveBeenCalledTimes(1);
				});

				expect(completeUfoExperience).toHaveBeenLastCalledWith(
					expect.any(String),
					'error',
					{
						fileMediatype: undefined,
						fileMimetype: undefined,
						fileId: fileItem.id,
						fileSize: undefined,
						fileStatus: undefined,
					},
					{ wasStatusUploading: false, wasStatusProcessing: false },
					expect.any(Object),
					new MediaCardError('metadata-fetch', new Error()),
				);
				expect((completeUfoExperience as jest.Mock).mock.calls[0][5].secondaryError).toMatchObject({
					reason: 'serverRateLimited',
					metadata: { statusCode: 429 },
				});
			});

			it('when a pollingMaxAttemptsExceeded error occurs (PollingError: pollingMaxAttemptsExceeded)', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);

				mediaApi.getItems = () => {
					throw createPollingMaxAttemptsError(2);
				};

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// card should completely process the error
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'error',
					),
				);

				await waitFor(() => {
					expect(completeUfoExperience).toHaveBeenCalledTimes(1);
				});

				expect(completeUfoExperience).toHaveBeenLastCalledWith(
					expect.any(String),
					'error',
					{
						fileMediatype: undefined,
						fileMimetype: undefined,
						fileId: fileItem.id,
						fileSize: undefined,
						fileStatus: undefined,
					},
					{ wasStatusUploading: false, wasStatusProcessing: false },
					expect.any(Object),
					new MediaCardError('metadata-fetch', new Error()),
				);
				expect((completeUfoExperience as jest.Mock).mock.calls[0][5].secondaryError).toMatchObject({
					reason: 'pollingMaxAttemptsExceeded',
					metadata: { attempts: 2 },
				});
			});
		});

		describe('should fire a screen event ', () => {
			it('when the file status is complete', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// simulate that the file has been fully loaded by the browser
				const img = await screen.findByTestId(imgTestId);
				await waitFor(async () => expect(img.getAttribute('src')).toBeTruthy());

				await simulateImageLoadDelay();
				fireEvent.load(img);

				// card should completely process the file
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'complete',
					),
				);

				expect(mockCreateAnalyticsEvent).toHaveBeenNthCalledWith(2, {
					eventType: 'screen',
					action: 'viewed',
					actionSubject: 'mediaCardRenderScreen',
					name: 'mediaCardRenderScreen',
					attributes: {
						type: fileItem.details.mediaType,
						fileAttributes: {
							fileMediatype: fileItem.details.mediaType,
							fileMimetype: fileItem.details.mimeType,
							fileId: fileItem.id,
							fileSize: fileItem.details.size,
							fileStatus: 'processed',
						},
					},
				});

				expect(event.fire).toHaveBeenCalledTimes(2); // 1 operational events, 1 screen event
				expect(event.fire).toHaveBeenCalledWith(ANALYTICS_MEDIA_CHANNEL);
			});

			it('when the file is a video and has a preview', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingVideo();
				const { mediaApi } = createMockedMediaApi(fileItem);

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// simulate that the file has been fully loaded by the browser
				const img = await screen.findByTestId(imgTestId);
				await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());
				await simulateImageLoadDelay();
				fireEvent.load(img);

				// card should completely process the file
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'complete',
					),
				);

				expect(mockCreateAnalyticsEvent).toHaveBeenNthCalledWith(2, {
					eventType: 'screen',
					action: 'viewed',
					actionSubject: 'mediaCardRenderScreen',
					name: 'mediaCardRenderScreen',
					attributes: {
						type: fileItem.details.mediaType,
						fileAttributes: {
							fileMediatype: fileItem.details.mediaType,
							fileMimetype: fileItem.details.mimeType,
							fileId: fileItem.id,
							fileSize: fileItem.details.size,
							fileStatus: 'processed',
						},
					},
				});

				expect(event.fire).toHaveBeenCalledTimes(2); // 1 operational events, 1 screen event
				expect(event.fire).toHaveBeenCalledWith(ANALYTICS_MEDIA_CHANNEL);
			});
		});

		describe('should fire an operational event', () => {
			it('when the card status changes (file identifier)', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { MockedMediaClientProvider, processItem } = createMockedMediaClientProvider({
					initialItems: fileItem,
				});

				processItem(fileItem, 0);

				render(
					<MockedMediaClientProvider>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'processing',
					),
				);

				processItem(fileItem, 1);

				// simulate that the file has been fully loaded by the browser
				const img = await screen.findByTestId(imgTestId, undefined);
				await waitFor(() => expect(img.getAttribute('src')).toBeTruthy(), { timeout: 5_000 });
				await simulateImageLoadDelay();
				fireEvent.load(img);

				// card should completely process the file
				await waitFor(
					async () =>
						expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
							'data-test-status',
							'complete',
						),
					{ timeout: 5_000 },
				);

				await waitFor(() => {
					expect(mockCreateAnalyticsEvent).toHaveBeenNthCalledWith(1, {
						eventType: 'operational',
						action: 'succeeded',
						actionSubject: 'mediaCardRender',
						attributes: {
							fileMimetype: fileItem.details.mimeType,
							fileAttributes: {
								fileMediatype: fileItem.details.mediaType,
								fileMimetype: fileItem.details.mimeType,
								fileId: fileItem.id,
								fileSize: fileItem.details.size,
								fileStatus: 'processed',
							},
							performanceAttributes: {
								overall: {
									durationSinceCommenced: 0,
									durationSincePageStart: PERFORMANCE_NOW,
								},
							},
							status: 'success',
							ssrReliability: { server: { status: 'unknown' }, client: { status: 'unknown' } },
							traceContext: { traceId: expect.any(String) },
							metadataTraceContext: { traceId: expect.any(String), spanId: expect.any(String) },
						},
					});
				});

				expect(event.fire).toHaveBeenCalledTimes(2); // 1 operational events, 1 screen event
				expect(event.fire).toHaveBeenCalledWith(ANALYTICS_MEDIA_CHANNEL);
			});

			it('when the card status changes (external image identifier)', async () => {
				const { mediaApi } = createMockedMediaApi();
				const extIdentifier = {
					mediaItemType: 'external-image',
					dataURI: 'ext-uri',
					name: 'ext',
				} as const;
				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={extIdentifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// simulate that the file has been fully loaded by the browser
				const img = await screen.findByTestId(imgTestId);
				await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());
				await simulateImageLoadDelay();
				fireEvent.load(img);

				// card should completely process the file
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'complete',
					),
				);

				await waitFor(() => {
					expect(mockCreateAnalyticsEvent).toHaveBeenNthCalledWith(1, {
						eventType: 'operational',
						action: 'succeeded',
						actionSubject: 'mediaCardRender',
						attributes: {
							fileMimetype: undefined,
							fileAttributes: {
								fileMediatype: 'image',
								fileId: extIdentifier.mediaItemType,
							},
							performanceAttributes: {
								overall: {
									durationSinceCommenced: 0,
									durationSincePageStart: PERFORMANCE_NOW,
								},
							},
							status: 'success',
							ssrReliability: { server: { status: 'unknown' }, client: { status: 'unknown' } },
							traceContext: { traceId: expect.any(String) },
							metadataTraceContext: undefined,
						},
					});
				});

				expect(event.fire).toHaveBeenCalledTimes(2); // 1 operational events, 1 screen event
				expect(event.fire).toHaveBeenCalledWith(ANALYTICS_MEDIA_CHANNEL);
			});

			it('when a serverRateLimited error occurs (RequestError: serverRateLimited)', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);

				mediaApi.getItems = () => {
					throw createRateLimitedError();
				};

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// card should completely process the error
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'error',
					),
				);

				await waitFor(() => {
					expect(mockCreateAnalyticsEvent).toHaveBeenNthCalledWith(1, {
						eventType: 'operational',
						action: 'failed',
						actionSubject: 'mediaCardRender',
						attributes: {
							fileMimetype: undefined,
							fileAttributes: {
								fileMediatype: undefined,
								fileMimetype: undefined,
								fileId: fileItem.id,
								fileSize: undefined,
								fileStatus: undefined,
							},
							performanceAttributes: {
								overall: {
									durationSinceCommenced: 0,
									durationSincePageStart: PERFORMANCE_NOW,
								},
							},
							status: 'fail',
							failReason: 'metadata-fetch',
							error: 'serverRateLimited',
							errorDetail: 'serverRateLimited',
							request: {
								traceContext: { traceId: expect.any(String), spanId: expect.any(String) },
								statusCode: 429,
								attempts: 5,
								clientExhaustedRetries: true,
								mediaEnv: 'test-media-env',
								mediaRegion: 'test-media-region',
							},
							ssrReliability: { server: { status: 'unknown' }, client: { status: 'unknown' } },
							traceContext: { traceId: expect.any(String) },
							metadataTraceContext: { traceId: expect.any(String), spanId: expect.any(String) },
						},
					});
				});

				expect(event.fire).toHaveBeenCalledTimes(1);
				expect(event.fire).toHaveBeenCalledWith(ANALYTICS_MEDIA_CHANNEL);
			});

			it('when a pollingMaxAttemptsExceeded error occurs (PollingError: pollingMaxAttemptsExceeded)', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);

				mediaApi.getItems = () => {
					throw createPollingMaxAttemptsError(2);
				};

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// card should completely process the error
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'error',
					),
				);

				await waitFor(() => {
					expect(mockCreateAnalyticsEvent).toHaveBeenNthCalledWith(1, {
						eventType: 'operational',
						action: 'failed',
						actionSubject: 'mediaCardRender',
						attributes: {
							fileMimetype: undefined,
							fileAttributes: {
								fileMediatype: undefined,
								fileMimetype: undefined,
								fileId: fileItem.id,
								fileSize: undefined,
								fileStatus: undefined,
							},
							performanceAttributes: {
								overall: {
									durationSinceCommenced: 0,
									durationSincePageStart: PERFORMANCE_NOW,
								},
							},
							status: 'fail',
							failReason: 'metadata-fetch',
							error: 'pollingMaxAttemptsExceeded',
							errorDetail: 'pollingMaxAttemptsExceeded',
							request: { attempts: 2 },
							ssrReliability: { server: { status: 'unknown' }, client: { status: 'unknown' } },
							traceContext: { traceId: expect.any(String) },
							metadataTraceContext: undefined,
						},
					});
				});

				expect(event.fire).toHaveBeenCalledTimes(1);
				expect(event.fire).toHaveBeenCalledWith(ANALYTICS_MEDIA_CHANNEL);
			});

			it('if status is failed-processing', async () => {
				const [fileItem, identifier] = generateSampleFileItem.failedPdf();
				const { mediaApi } = createMockedMediaApi(fileItem);

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// card should completely process the error
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'failed-processing',
					),
				);

				await waitFor(() => {
					expect(mockCreateAnalyticsEvent).toHaveBeenNthCalledWith(1, {
						eventType: 'operational',
						action: 'failed',
						actionSubject: 'mediaCardRender',
						attributes: {
							fileMimetype: fileItem.details.mimeType,
							fileAttributes: {
								fileMediatype: fileItem.details.mediaType,
								fileMimetype: fileItem.details.mimeType,
								fileId: fileItem.id,
								fileSize: fileItem.details.size,
								fileStatus: 'failed-processing',
							},
							performanceAttributes: {
								overall: {
									durationSinceCommenced: 0,
									durationSincePageStart: PERFORMANCE_NOW,
								},
							},
							status: 'fail',
							failReason: 'failed-processing',
							ssrReliability: { server: { status: 'unknown' }, client: { status: 'unknown' } },
							traceContext: { traceId: expect.any(String) },
							metadataTraceContext: { traceId: expect.any(String), spanId: expect.any(String) },
						},
					});
				});

				expect(event.fire).toHaveBeenCalledTimes(1);
				expect(event.fire).toHaveBeenCalledWith(ANALYTICS_MEDIA_CHANNEL);
			});

			it('when a serverUnauthorized error occurs on the /image endpoint', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);

				mediaApi.getImage = () => {
					throw createServerUnauthorizedError();
				};

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// card should completely process the error
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'error',
					),
				);

				await waitFor(() => {
					expect(mockCreateAnalyticsEvent).toHaveBeenNthCalledWith(1, {
						eventType: 'operational',
						action: 'failed',
						actionSubject: 'mediaCardRender',
						attributes: {
							fileMimetype: fileItem.details.mimeType,
							fileAttributes: {
								fileMediatype: fileItem.details.mediaType,
								fileMimetype: fileItem.details.mimeType,
								fileId: fileItem.id,
								fileSize: fileItem.details.size,
								fileStatus: 'processed',
							},
							performanceAttributes: {
								overall: {
									durationSinceCommenced: 0,
									durationSincePageStart: PERFORMANCE_NOW,
								},
							},
							status: 'fail',
							failReason: 'remote-preview-fetch',
							error: 'serverUnauthorized',
							errorDetail: 'serverUnauthorized',
							request: {
								attempts: 5,
								clientExhaustedRetries: true,
								mediaRegion: 'test-media-region',
								mediaEnv: 'test-media-env',
								statusCode: 403,
								traceContext: { traceId: expect.any(String), spanId: expect.any(String) },
							},
							ssrReliability: { server: { status: 'unknown' }, client: { status: 'unknown' } },
							traceContext: { traceId: expect.any(String) },
							metadataTraceContext: { traceId: expect.any(String), spanId: expect.any(String) },
						},
					});
				});

				expect(event.fire).toHaveBeenCalledTimes(1);
				expect(event.fire).toHaveBeenCalledWith(ANALYTICS_MEDIA_CHANNEL);
			});

			it('when a serverUnauthorized error occurs on the /items endpoint', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);

				mediaApi.getItems = () => {
					throw createServerUnauthorizedError();
				};

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// card should completely process the error
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'error',
					),
				);

				await waitFor(() => {
					expect(mockCreateAnalyticsEvent).toHaveBeenNthCalledWith(1, {
						eventType: 'operational',
						action: 'failed',
						actionSubject: 'mediaCardRender',
						attributes: {
							fileMimetype: undefined,
							fileAttributes: {
								fileMediatype: undefined,
								fileMimetype: undefined,
								fileId: fileItem.id,
								fileSize: undefined,
								fileStatus: undefined,
							},
							performanceAttributes: {
								overall: {
									durationSinceCommenced: 0,
									durationSincePageStart: PERFORMANCE_NOW,
								},
							},
							status: 'fail',
							failReason: 'metadata-fetch',
							error: 'serverUnauthorized',
							errorDetail: 'serverUnauthorized',
							request: {
								attempts: 5,
								clientExhaustedRetries: true,
								mediaEnv: 'test-media-env',
								mediaRegion: 'test-media-region',
								statusCode: 403,
								traceContext: { traceId: expect.any(String), spanId: expect.any(String) },
							},
							ssrReliability: { server: { status: 'unknown' }, client: { status: 'unknown' } },
							traceContext: { traceId: expect.any(String) },
							metadataTraceContext: { traceId: expect.any(String), spanId: expect.any(String) },
						},
					});
				});

				expect(event.fire).toHaveBeenCalledTimes(1);
				expect(event.fire).toHaveBeenCalledWith(ANALYTICS_MEDIA_CHANNEL);
			});

			it('when no items are returned from the /items endpoint', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(); // Intentionally skipping fileItem

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// card should completely process the error
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'error',
					),
				);

				await waitFor(() => {
					expect(mockCreateAnalyticsEvent).toHaveBeenNthCalledWith(1, {
						eventType: 'operational',
						action: 'failed',
						actionSubject: 'mediaCardRender',
						attributes: {
							fileMimetype: undefined,
							fileAttributes: {
								fileMediatype: undefined,
								fileMimetype: undefined,
								fileId: fileItem.id,
								fileSize: undefined,
								fileStatus: undefined,
							},
							performanceAttributes: {
								overall: {
									durationSinceCommenced: 0,
									durationSincePageStart: PERFORMANCE_NOW,
								},
							},
							status: 'fail',
							failReason: 'metadata-fetch',
							error: 'emptyItems',
							errorDetail: 'emptyItems',
							request: {
								id: fileItem.id,
								collectionName: 'MediaServicesSample',
								occurrenceKey: undefined,
								traceContext: { traceId: expect.any(String), spanId: expect.any(String) },
							},
							ssrReliability: { server: { status: 'unknown' }, client: { status: 'unknown' } },
							traceContext: { traceId: expect.any(String) },
							metadataTraceContext: { traceId: expect.any(String), spanId: expect.any(String) },
						},
					});
				});

				expect(event.fire).toHaveBeenCalledTimes(1);
				expect(event.fire).toHaveBeenCalledWith(ANALYTICS_MEDIA_CHANNEL);
			});
		});

		it('should fire a non-critical error event if an error occurs when refetching a preview with bigger dimensions', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			mediaApi.getImage = async () => {
				throw new Error('mediaApi.getImage: remote-preview-fetch');
			};

			const expectedPreview = {
				dataURI: 'global-scope-datauri',
				source: 'ssr-data',
				dimensions: { width: 100, height: 100 },
			};

			const { id, collectionName } = identifier;
			setGlobalSSRData(`${id}-${collectionName}`, expectedPreview);

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						dimensions={{ width: 500, height: 500 }}
						ssr="client"
					/>
				</MockedMediaClientProvider>,
			);

			// wait for ViewportDetector to be mounted before turning the card visible
			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'loading',
				),
			);
			makeVisible();

			await waitFor(() => expect(event.fire).toHaveBeenCalledTimes(1));

			expect(mockCreateAnalyticsEvent).toHaveBeenNthCalledWith(1, {
				eventType: 'operational',
				action: 'nonCriticalFail',
				actionSubject: 'mediaCardRender',
				attributes: {
					fileAttributes: {
						fileMediatype: fileItem.details.mediaType,
						fileMimetype: fileItem.details.mimeType,
						fileId: fileItem.id,
						fileSize: fileItem.details.size,
						fileStatus: 'processed',
					},
					status: 'fail',
					failReason: 'remote-preview-fetch',
					error: 'nativeError',
					errorDetail: 'mediaApi.getImage: remote-preview-fetch',
					request: undefined,
					ssrReliability: { server: { status: 'unknown' }, client: { status: 'unknown' } },
					traceContext: { traceId: expect.any(String) },
					metadataTraceContext: { traceId: expect.any(String), spanId: expect.any(String) },
					cardStatus: 'loading-preview',
				},
			});

			expect(event.fire).toHaveBeenCalledWith(ANALYTICS_MEDIA_CHANNEL);

			const img: HTMLImageElement = await screen.findByTestId(imgTestId);
			expect(img).toBeInTheDocument();
			expect(img.src).toContain('global-scope-datauri');
		});

		describe('should abort the experience', () => {
			it('when the component is unmounted (file identifier)', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);

				const { unmount } = render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// simulate that the file has been fully loaded by the browser
				const img = await screen.findByTestId(imgTestId);
				await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());
				await simulateImageLoadDelay();
				fireEvent.load(img);

				// card should completely process the file
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'complete',
					),
				);

				unmount();
				expect(abortUfoExperience).toHaveBeenCalledTimes(1);
				expect(abortUfoExperience).toHaveBeenCalledWith(expect.any(String), {
					fileAttributes: {
						fileId: fileItem.id,
						fileMediatype: fileItem.details.mediaType,
						fileMimetype: fileItem.details.mimeType,
						fileSize: fileItem.details.size,
						fileStatus: 'processed',
					},
					fileStateFlags: {
						wasStatusProcessing: false,
						wasStatusUploading: false,
					},
					ssrReliability: {
						client: {
							status: 'unknown',
						},
						server: {
							status: 'unknown',
						},
					},
				});
			});

			it('when the component is unmounted (external image identifier)', async () => {
				const { mediaApi } = createMockedMediaApi();
				const extIdentifier = {
					mediaItemType: 'external-image',
					dataURI: 'ext-uri',
					name: 'ext',
				} as const;

				const { unmount } = render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={extIdentifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// simulate that the file has been fully loaded by the browser
				const img = await screen.findByTestId(imgTestId);
				await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());
				await simulateImageLoadDelay();
				fireEvent.load(img);

				// card should completely process the file
				await waitFor(async () =>
					expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
						'data-test-status',
						'complete',
					),
				);

				unmount();
				expect(abortUfoExperience).toHaveBeenCalledTimes(1);
				expect(abortUfoExperience).toHaveBeenCalledWith(expect.any(String), {
					fileAttributes: {
						fileMediatype: 'image',
						fileId: extIdentifier.mediaItemType,
					},
					fileStateFlags: {
						wasStatusProcessing: false,
						wasStatusUploading: false,
					},
					ssrReliability: {
						client: {
							status: 'unknown',
						},
						server: {
							status: 'unknown',
						},
					},
				});
			});
		});
	});

	describe.each([true, false])('SVG (disableOverlay: %p )', (disableOverlay) => {
		it('should render SVG natively', async () => {
			const [fileItem, identifier] = generateSampleFileItem.svg();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
						disableOverlay={disableOverlay}
					/>
				</MockedMediaClientProvider>,
			);

			const elem = await screen.findAllByTestId('media-card-svg');
			expect(elem[0]).toBeDefined();
			const imgElement = elem[0];
			expect(imgElement.nodeName.toLowerCase()).toBe('img');

			fireEvent.load(imgElement);

			// card should completely process the file
			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'complete',
				),
			);

			const fileAttributes = {
				fileId: identifier.id,
				fileMediatype: fileItem.details.mediaType,
				fileMimetype: fileItem.details.mimeType,
				fileSize: fileItem.details.size,
				fileStatus: 'processed',
			};

			expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith({
				action: 'succeeded',
				actionSubject: 'mediaCardRender',
				attributes: {
					fileAttributes,
					fileMimetype: 'image/svg+xml',
					performanceAttributes: {
						overall: { durationSinceCommenced: 0, durationSincePageStart: 1000 },
					},
					ssrReliability: { client: { status: 'unknown' }, server: { status: 'unknown' } },
					status: 'success',
					metadataTraceContext: {
						spanId: expect.any(String),
						traceId: expect.any(String),
					},
					traceContext: { traceId: expect.any(String) },
				},
				eventType: 'operational',
			});
		});

		it('should not render error screen when the preview fails to load', async () => {
			const [fileItem, identifier] = generateSampleFileItem.svg();
			const { mediaApi } = createMockedMediaApi(fileItem);

			// The preview fails but the binary is OK. Card should not fail
			mediaApi.getImage = () => {
				throw createServerUnauthorizedError();
			};

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
						disableOverlay={disableOverlay}
					/>
				</MockedMediaClientProvider>,
			);

			const elem = await screen.findAllByTestId('media-card-svg');
			expect(elem[0]).toBeDefined();
			const imgElement = elem[0];
			expect(imgElement.nodeName.toLowerCase()).toBe('img');

			fireEvent.load(imgElement);

			// card should completely process the file
			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'complete',
				),
			);

			const fileAttributes = {
				fileId: identifier.id,
				fileMediatype: fileItem.details.mediaType,
				fileMimetype: fileItem.details.mimeType,
				fileSize: fileItem.details.size,
				fileStatus: 'processed',
			};

			expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith({
				action: 'succeeded',
				actionSubject: 'mediaCardRender',
				attributes: {
					fileAttributes,
					fileMimetype: 'image/svg+xml',
					performanceAttributes: {
						overall: { durationSinceCommenced: 0, durationSincePageStart: 1000 },
					},
					ssrReliability: { client: { status: 'unknown' }, server: { status: 'unknown' } },
					status: 'success',
					metadataTraceContext: {
						spanId: expect.any(String),
						traceId: expect.any(String),
					},
					traceContext: { traceId: expect.any(String) },
				},
				eventType: 'operational',
			});
		});

		it('should not render error screen when the file failed processing', async () => {
			const [fileItem, identifier] = generateSampleFileItem.svgFailedProcessing();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
						disableOverlay={disableOverlay}
					/>
				</MockedMediaClientProvider>,
			);

			const elem = await screen.findAllByTestId('media-card-svg');
			expect(elem[0]).toBeDefined();
			const imgElement = elem[0];
			expect(imgElement.nodeName.toLowerCase()).toBe('img');

			fireEvent.load(imgElement);

			// card should completely process the file
			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'complete',
				),
			);

			const fileAttributes = {
				fileId: identifier.id,
				fileMediatype: fileItem.details.mediaType,
				fileMimetype: fileItem.details.mimeType,
				fileSize: fileItem.details.size,
				fileStatus: 'failed-processing',
			};

			expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith({
				action: 'succeeded',
				actionSubject: 'mediaCardRender',
				attributes: {
					fileAttributes,
					fileMimetype: 'image/svg+xml',
					performanceAttributes: {
						overall: { durationSinceCommenced: 0, durationSincePageStart: 1000 },
					},
					ssrReliability: { client: { status: 'unknown' }, server: { status: 'unknown' } },
					status: 'success',
					metadataTraceContext: {
						spanId: expect.any(String),
						traceId: expect.any(String),
					},
					traceContext: { traceId: expect.any(String) },
				},
				eventType: 'operational',
			});
		});

		it('should not render error screen when the file has no preview', async () => {
			// The file item is "processed without preview"
			const [fileItem, identifier] = generateSampleFileItem.svgWithoutPreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
						disableOverlay={disableOverlay}
					/>
				</MockedMediaClientProvider>,
			);

			const elem = await screen.findAllByTestId('media-card-svg');
			expect(elem[0]).toBeDefined();
			const imgElement = elem[0];
			expect(imgElement.nodeName.toLowerCase()).toBe('img');

			fireEvent.load(imgElement);

			// card should completely process the file
			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'complete',
				),
			);

			const fileAttributes = {
				fileId: identifier.id,
				fileMediatype: fileItem.details.mediaType,
				fileMimetype: fileItem.details.mimeType,
				fileSize: fileItem.details.size,
				fileStatus: 'processed',
			};

			expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith({
				action: 'succeeded',
				actionSubject: 'mediaCardRender',
				attributes: {
					fileAttributes,
					fileMimetype: 'image/svg+xml',
					performanceAttributes: {
						overall: { durationSinceCommenced: 0, durationSincePageStart: 1000 },
					},
					ssrReliability: { client: { status: 'unknown' }, server: { status: 'unknown' } },
					status: 'success',
					metadataTraceContext: {
						spanId: expect.any(String),
						traceId: expect.any(String),
					},
					traceContext: { traceId: expect.any(String) },
				},
				eventType: 'operational',
			});
		});

		it('should render error screen when SVG binary fails to load', async () => {
			const [fileItem, identifier] = generateSampleFileItem.svg();
			const { mediaApi } = createMockedMediaApi(fileItem);

			// simulate error
			jest.spyOn(mediaApi, 'getFileBinary').mockRejectedValue(createServerUnauthorizedError());

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
						disableOverlay={disableOverlay}
					/>
				</MockedMediaClientProvider>,
			);

			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'error',
				),
			);

			const fileAttributes = {
				fileId: identifier.id,
				fileMediatype: fileItem.details.mediaType,
				fileMimetype: fileItem.details.mimeType,
				fileSize: fileItem.details.size,
				fileStatus: 'processed',
			};

			await waitFor(() => {
				expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith({
					action: 'failed',
					actionSubject: 'mediaCardRender',
					attributes: {
						error: 'serverUnauthorized',
						errorDetail: 'serverUnauthorized',
						failReason: 'svg-binary-fetch',
						fileAttributes,
						fileMimetype: 'image/svg+xml',
						performanceAttributes: {
							overall: { durationSinceCommenced: 0, durationSincePageStart: 1000 },
						},
						request: {
							attempts: 5,
							clientExhaustedRetries: true,
							mediaEnv: 'test-media-env',
							mediaRegion: 'test-media-region',
							statusCode: 403,
							traceContext: {
								spanId: expect.any(String),
								traceId: expect.any(String),
							},
						},
						ssrReliability: { client: { status: 'unknown' }, server: { status: 'unknown' } },
						status: 'fail',
						metadataTraceContext: {
							spanId: expect.any(String),
							traceId: expect.any(String),
						},
						traceContext: { traceId: expect.any(String) },
					},
					eventType: 'operational',
				});
			});
		});

		it('should render error screen when image tag fails to render the file', async () => {
			const [fileItem, identifier] = generateSampleFileItem.svg();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
						disableOverlay={disableOverlay}
					/>
				</MockedMediaClientProvider>,
			);

			const elem = await screen.findAllByTestId('media-card-svg');
			expect(elem[0]).toBeDefined();
			const imgElement = elem[0];
			expect(imgElement.nodeName.toLowerCase()).toBe('img');
			fireEvent.error(imgElement);

			await waitFor(async () =>
				expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
					'data-test-status',
					'error',
				),
			);

			const fileAttributes = {
				fileId: identifier.id,
				fileMediatype: fileItem.details.mediaType,
				fileMimetype: fileItem.details.mimeType,
				fileSize: fileItem.details.size,
				fileStatus: 'processed',
			};

			await waitFor(() => {
				expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith({
					action: 'failed',
					actionSubject: 'mediaCardRender',
					attributes: {
						error: 'nativeError',
						errorDetail: 'svg-img-error',
						failReason: 'svg-img-error',
						fileAttributes,
						fileMimetype: 'image/svg+xml',
						performanceAttributes: {
							overall: { durationSinceCommenced: 0, durationSincePageStart: 1000 },
						},
						ssrReliability: { client: { status: 'unknown' }, server: { status: 'unknown' } },
						status: 'fail',
						metadataTraceContext: {
							spanId: expect.any(String),
							traceId: expect.any(String),
						},
						traceContext: { traceId: expect.any(String) },
					},
					eventType: 'operational',
				});
			});
		});

		describe('should render SVG with correct resizing styles', () => {
			async function renderSvgCard(imgElement: HTMLImageElement, resizeMode: string) {
				const [fileItem, identifier] = generateSampleFileItem.svg();
				const { mediaApi } = createMockedMediaApi(fileItem);
				const parentElement = {
					getBoundingClientRect: () => ({ width: 1200, height: 800 }),
				} as unknown as HTMLElement; // 1.5:1 aspect ratio

				calculateSvgDimensionsMock.mockImplementationOnce(() => {
					return svgHelpersModule.calculateSvgDimensions(
						imgElement,
						parentElement,
						resizeMode as ImageResizeMode,
					);
				});

				render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
							disableOverlay={disableOverlay}
						/>
					</MockedMediaClientProvider>,
				);

				const elem = await screen.findAllByTestId('media-card-svg');
				return elem[0];
			}

			describe('Image is same aspect ratio or more landscape than parent wrapper', () => {
				const imgElement = {
					naturalWidth: 1600,
					width: 1600,
					naturalHeight: 800,
					height: 800,
				} as HTMLImageElement; // 2:1 aspect ratio

				it.each([
					['fit', { maxWidth: 'min(100%, 1600px)', maxHeight: 'min(100%, 800px)' }],
					['full-fit', { maxWidth: 'min(100%, 1600px)', maxHeight: 'min(100%, 800px)' }],
					['crop', { height: '800px', maxHeight: '100%' }],
					['stretchy-fit', { width: '100%', maxHeight: '100%' }],
				])('returns correct style for %s mode', async (resizeMode, expectedStyle) => {
					const imgElem = await renderSvgCard(imgElement, resizeMode);
					expect(imgElem.nodeName.toLowerCase()).toBe('img');
					fireEvent.load(imgElem);
					expect(imgElem).toHaveStyle(expectedStyle);
				});
			});

			describe('Image is more portrait than parent wrapper', () => {
				const imgElement = {
					naturalWidth: 800,
					width: 800,
					naturalHeight: 1600,
					height: 1600,
				} as HTMLImageElement; // 1:2 aspect ratio

				it.each([
					['fit', { maxWidth: 'min(100%, 800px)', maxHeight: 'min(100%, 1600px)' }],
					['full-fit', { maxWidth: 'min(100%, 800px)', maxHeight: 'min(100%, 1600px)' }],
					['crop', { width: '800px', maxWidth: '100%' }],
					['stretchy-fit', { height: '100%', maxWidth: '100%' }],
				])('returns correct style for %s mode', async (resizeMode, expectedStyle) => {
					const imgElem = await renderSvgCard(imgElement, resizeMode);
					expect(imgElem.nodeName.toLowerCase()).toBe('img');
					fireEvent.load(imgElem);
					expect(imgElem).toHaveStyle(expectedStyle);
				});
			});

			describe('Image natural dimensions are 0 and is more landscape than parent wrapper', () => {
				const imgElement = {
					naturalWidth: 0,
					width: 1600,
					naturalHeight: 0,
					height: 800,
				} as HTMLImageElement; // 2:1 aspect ratio

				it.each([
					['fit', { maxWidth: 'min(100%, 1600px)', maxHeight: 'min(100%, 800px)' }],
					['full-fit', { maxWidth: 'min(100%, 1600px)', maxHeight: 'min(100%, 800px)' }],
					['crop', { height: '800px', maxHeight: '100%' }],
					['stretchy-fit', { width: '100%', maxHeight: '100%' }],
				])('returns correct style for %s mode', async (resizeMode, expectedStyle) => {
					const imgElem = await renderSvgCard(imgElement, resizeMode);
					expect(imgElem.nodeName.toLowerCase()).toBe('img');
					fireEvent.load(imgElem);
					expect(imgElem).toHaveStyle(expectedStyle);
				});
			});

			describe('Image natural dimensions are 0 and is more portrait than parent wrapper', () => {
				const imgElement = {
					naturalWidth: 0,
					width: 800,
					naturalHeight: 0,
					height: 1600,
				} as HTMLImageElement; // 1:2 aspect ratio

				it.each([
					['fit', { maxWidth: 'min(100%, 800px)', maxHeight: 'min(100%, 1600px)' }],
					['full-fit', { maxWidth: 'min(100%, 800px)', maxHeight: 'min(100%, 1600px)' }],
					['crop', { width: '800px', maxWidth: '100%' }],
					['stretchy-fit', { height: '100%', maxWidth: '100%' }],
				])('returns correct style for %s mode', async (resizeMode, expectedStyle) => {
					const imgElem = await renderSvgCard(imgElement, resizeMode);
					expect(imgElem.nodeName.toLowerCase()).toBe('img');
					fireEvent.load(imgElem);
					expect(imgElem).toHaveStyle(expectedStyle);
				});
			});
		});
	});
});
