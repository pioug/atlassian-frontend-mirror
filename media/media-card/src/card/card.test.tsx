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
jest.mock('./cardAnalytics', () => {
	const actualModule = jest.requireActual('./cardAnalytics');
	return {
		__esModule: true,
		...actualModule,
		fireOperationalEvent: jest.fn(actualModule.fireOperationalEvent),
		fireNonCriticalErrorEvent: jest.fn(actualModule.fireNonCriticalErrorEvent),
		fireCopiedEvent: jest.fn(actualModule.fireCopiedEvent),
		fireCommencedEvent: jest.fn(actualModule.fireCommencedEvent),
		fireScreenEvent: jest.fn(actualModule.fireScreenEvent),
	};
});

import { useAnalyticsEvents, type CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import * as svgHelpersModule from './svgView/helpers';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CardLoader from './cardLoader';
import React from 'react';
import { MediaFileStateError } from '@atlaskit/media-client-react';
import { MockedMediaClientProvider } from '@atlaskit/media-client-react/test-helpers';
import { createMockedMediaClientProvider } from '../__tests__/utils/mockedMediaClientProvider/_MockedMediaClientProvider';
import { createMockedMediaApi } from '@atlaskit/media-client/test-helpers';
import { generateSampleFileItem, sampleBinaries } from '@atlaskit/media-test-data';
import { tallImage, asMockFunction } from '@atlaskit/media-test-helpers';
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
import {
	fireNonCriticalErrorEvent,
	fireOperationalEvent,
	fireCommencedEvent,
	fireScreenEvent,
} from './cardAnalytics';
import { MediaCardError } from '../errors';
import { MockIntersectionObserver } from '../utils/mockIntersectionObserver';
import { DateOverrideContext } from '../dateOverrideContext';
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

			// ensure that an img is never rendered
			await expect(screen.findByTestId(imgTestId)).rejects.toThrow();

			// should not render A title box
			expect(screen.queryByTestId(titleBoxTestId)).not.toBeInTheDocument();
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

			const { container } = render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader mediaClientConfig={dummyMediaClientConfig} identifier={identifier} />
				</MockedMediaClientProvider>,
			);

			// wait for ViewportDetector to be mounted before turning the card visible
			await waitFor(() =>
				expect(container.querySelector('[data-test-status="loading"]')).toBeInTheDocument(),
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

			const { container } = render(
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
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(() =>
				expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
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

			const { container } = render(
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
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(() =>
				expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
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
			const { container } = render(
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
			const img = await screen.findByTestId(imgTestId);
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(() =>
				expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
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

			const { container } = render(
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
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(() =>
				expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
			);

			expect((img as HTMLImageElement).alt).toBe('name.pdf');
		});

		it('should render preview without the alternative text if an empty string is provided', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			const { container } = render(
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
			const img = await screen.findByTestId(imgTestId);
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(() =>
				expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
			);

			expect((img as HTMLImageElement).alt).toBe('');
		});

		it('should render preview with alternative text when "alt" is provided', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			const { container } = render(
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
			const img = await screen.findByTestId(imgTestId);
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(() =>
				expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
			);

			expect((img as HTMLImageElement).alt).toBe('alt text');
		});

		it('should render preview with mediaBlobUrlAttrs attached', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			const { container } = render(
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
			const img = await screen.findByTestId(imgTestId);
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(() =>
				expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
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

			const { container } = render(
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
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(() =>
				expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
			);

			const style = window.getComputedStyle(img);
			expect(style.maxWidth).toBe('100%');
			expect(style.maxHeight).toBe('');
		});

		// TODO - investigate if "fit" and "full-fit" are redundantly identical
		it('should render "fit" resize mode correctly', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			const { container } = render(
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
			const img = await screen.findByTestId(imgTestId);
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(() =>
				expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
			);

			const style = window.getComputedStyle(img);
			expect(style.maxWidth).toBe('100%');
			expect(style.maxHeight).toBe('100%');
		});

		it('should render "full-fit" resize mode correctly', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			const { container } = render(
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
			const img = await screen.findByTestId(imgTestId);
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(() =>
				expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
			);

			const style = window.getComputedStyle(img);
			expect(style.maxWidth).toBe('100%');
			expect(style.maxHeight).toBe('100%');
		});

		it('should render "stretchy-fit" resize mode correctly', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			const { container } = render(
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
			const img = await screen.findByTestId(imgTestId);
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(() =>
				expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
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

			const { container } = render(
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
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(() =>
				expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
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

				const { container } = render(
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
				fireEvent.load(img);

				await waitFor(() =>
					expect(container.querySelector('[data-test-status="uploading"]')).toBeInTheDocument(),
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

			const { container } = render(
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
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(() =>
				expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
			);

			// should not be selected
			expect(container.querySelector('[data-test-selected="true"]')).toBeNull();
		});

		it('should render as selected', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			const { container } = render(
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
			const img = await screen.findByTestId(imgTestId);
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(() =>
				expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
			);

			// should be selected
			expect(container.querySelector('[data-test-selected="true"]')).toBeInTheDocument();
		});
	});

	describe('should render a tick box appropriately', () => {
		it('should not render a tick box by default', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			const { container } = render(
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
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(() =>
				expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
			);

			expect(screen.queryByLabelText('tick')).not.toBeInTheDocument();
		});

		it('should render a tick box when the card is "selectable"', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			const { container } = render(
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
			const img = await screen.findByTestId(imgTestId);
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(() =>
				expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
			);

			expect(screen.getByLabelText('tick')).toBeInTheDocument();
		});
	});

	describe('should render card correctly', () => {
		describe('when "disableOverlay" is false by default', () => {
			it('when there is no remote preview', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithoutRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);

				const { container } = render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// card should completely process the error
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
				);

				// should not render a preview img
				expect(screen.queryByTestId(imgTestId)).not.toBeInTheDocument();

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

				const { container } = render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// card should completely process the error
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="error"]')).toBeInTheDocument(),
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

				const { container } = render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// card should be attempting to load the preview
				await waitFor(() =>
					expect(
						container.querySelector('[data-test-status="loading-preview"]'),
					).toBeInTheDocument(),
				);

				// simulate that the file was unsuccessfully loaded in the browser
				const img = await screen.findByTestId(imgTestId);
				fireEvent.error(img);

				// card should completely process the error
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="error"]')).toBeInTheDocument(),
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

				const { container } = render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// card should completely process the error
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="error"]')).toBeInTheDocument(),
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

				const { container } = render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// card should completely process the error
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="error"]')).toBeInTheDocument(),
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

				const { container } = render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// card should completely process the error
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="error"]')).toBeInTheDocument(),
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

				const { container } = render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// card should completely process the error
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="error"]')).toBeInTheDocument(),
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

				const { container } = render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// card should completely process the error
				await waitFor(() =>
					expect(
						container.querySelector('[data-test-status="failed-processing"]'),
					).toBeInTheDocument(),
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

				const { container } = render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// card should be processing
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="processing"]')).toBeInTheDocument(),
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

				const { container } = render(
					<MockedMediaClientProvider>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// card should be uploading
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="uploading"]')).toBeInTheDocument(),
				);

				// should not render a preview img
				expect(screen.queryByTestId(imgTestId)).not.toBeInTheDocument();

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
				expect(container.querySelector('[aria-valuenow="0"]')).toBeInTheDocument();
				expect(container.querySelector('[data-test-progress="0"]')).toBeInTheDocument();
			});

			it('when uploading with a progress of 0.5', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { MockedMediaClientProvider, uploadItem } = createMockedMediaClientProvider({
					initialItems: fileItem,
				});

				uploadItem(fileItem, 0.5);

				const { container } = render(
					<MockedMediaClientProvider>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// card should be uploading
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="uploading"]')).toBeInTheDocument(),
				);

				// use fake timer to pause the card in its uploading state
				jest.useFakeTimers();

				// should not render a preview img
				expect(screen.queryByTestId(imgTestId)).not.toBeInTheDocument();

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
				expect(container.querySelector('[aria-valuenow="50"]')).toBeInTheDocument();
				expect(container.querySelector('[data-test-progress="0.5"]')).toBeInTheDocument();

				// set timers back to normal
				jest.runOnlyPendingTimers();
				jest.useRealTimers();
			});

			it('when successfully being processed after uploading without a local preview', async () => {
				// using Jest's useFakeTimers to accelerate the polling function
				jest.useFakeTimers();

				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { MockedMediaClientProvider, uploadItem, processItem } =
					createMockedMediaClientProvider({
						initialItems: fileItem,
					});

				uploadItem(fileItem, 0.5);

				const { container } = render(
					<MockedMediaClientProvider>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// card should be attempting in uploading status
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="uploading"]')).toBeInTheDocument(),
				);

				uploadItem(fileItem, 1);
				processItem(fileItem, 1);

				jest.runAllTimers();

				// simulate that the file has been fully loaded by the browser
				const img = await screen.findByTestId(imgTestId, undefined);
				fireEvent.load(img);

				// card should be fully processeds
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
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
				expect(container.querySelector('[data-test-progress="1"]')).toBeInTheDocument();

				// set timers back to normal
				jest.runOnlyPendingTimers();
				jest.useRealTimers();
			});

			it('when uploading with a local preview', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
				const { MockedMediaClientProvider, uploadItem } = createMockedMediaClientProvider({
					initialItems: fileItem,
				});

				uploadItem(fileItem, 0.8);

				const { container } = render(
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
				expect(container.querySelector('[aria-valuenow="80"]')).toBeInTheDocument();
				expect(container.querySelector('[data-test-progress="0.8"]')).toBeInTheDocument();
			});

			it('when successfully being processed after uploading with a local preview', async () => {
				// using Jest's Fake Timer to accelerate the polling function
				jest.useFakeTimers();

				const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
				const { MockedMediaClientProvider, uploadItem, processItem } =
					createMockedMediaClientProvider({
						initialItems: fileItem,
					});

				uploadItem(fileItem, 0.5);

				const { container } = render(
					<MockedMediaClientProvider>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				await waitFor(() =>
					expect(container.querySelector('[data-test-status="uploading"]')).toBeInTheDocument(),
				);

				uploadItem(fileItem, 1);
				processItem(fileItem, 1);

				jest.runAllTimers();

				// simulate that the file has been fully loaded by the browser
				const img = await screen.findByTestId(imgTestId);
				fireEvent.load(img);

				// card should be fully processed
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
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
				expect(container.querySelector('[data-test-progress="1"]')).toBeInTheDocument();

				// set timers back to normal
				jest.runOnlyPendingTimers();
				jest.useRealTimers();
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

				// should never render an image
				await expect(screen.findByTestId(imgTestId)).rejects.toThrow();

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

				const { container } = render(
					<MockedMediaClientProvider>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				await waitFor(() =>
					expect(container.querySelector('[data-test-status="uploading"]')).toBeInTheDocument(),
				);

				uploadItem(fileItem, 'error');

				await waitFor(() =>
					expect(container.querySelector('[data-test-status="error"]')).toBeInTheDocument(),
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

				const { container } = render(
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
				fireEvent.load(img);

				// card should completely process
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
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
						expect(container.querySelector('[data-test-status="error"]')).toBeInTheDocument(),
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

				const { container } = render(
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
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
				);

				// should render the updated date
				expect(screen.queryByText('02 Jun 2024, 11:56 PM')).toBeInTheDocument();
			});
		});

		describe('when "disableOverlay" is true', () => {
			it('when there is no remote preview', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithoutRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);

				const { container } = render(
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
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
				);

				// should not render a preview img
				expect(screen.queryByTestId(imgTestId)).not.toBeInTheDocument();

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

				const { container } = render(
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
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="error"]')).toBeInTheDocument(),
				);

				// should not render a preview img
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

				const { container } = render(
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
				await waitFor(() =>
					expect(
						container.querySelector('[data-test-status="loading-preview"]'),
					).toBeInTheDocument(),
				);

				// simulate that the file was unsuccessfully loaded in the browser
				const img = await screen.findByTestId(imgTestId);
				fireEvent.error(img);

				// card should completely process the error
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="error"]')).toBeInTheDocument(),
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

				const { container } = render(
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
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="error"]')).toBeInTheDocument(),
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

				const { container } = render(
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
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="error"]')).toBeInTheDocument(),
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

				const { container } = render(
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
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="error"]')).toBeInTheDocument(),
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

				const { container } = render(
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
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="error"]')).toBeInTheDocument(),
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

				const { container } = render(
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
				await waitFor(() =>
					expect(
						container.querySelector('[data-test-status="failed-processing"]'),
					).toBeInTheDocument(),
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

				const { container } = render(
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
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="processing"]')).toBeInTheDocument(),
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

				const { container } = render(
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
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="uploading"]')).toBeInTheDocument(),
				);

				// use fake timer to pause when the card is uploading
				jest.useFakeTimers();

				// should not render a preview img
				expect(screen.queryByTestId(imgTestId)).not.toBeInTheDocument();

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
				expect(container.querySelector('[aria-valuenow="0"]')).toBeInTheDocument();
				expect(container.querySelector('[data-test-progress="0"]')).toBeInTheDocument();

				// set timers back to normal
				jest.runOnlyPendingTimers();
				jest.useRealTimers();
			});

			it('when uploading with a progress of 0.5', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { MockedMediaClientProvider, uploadItem } = createMockedMediaClientProvider({
					initialItems: fileItem,
				});

				uploadItem(fileItem, 0.5);

				const { container } = render(
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
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="uploading"]')).toBeInTheDocument(),
				);

				// use fake timer to pause the card in its uploading state
				jest.useFakeTimers();

				// should not render a preview img
				expect(screen.queryByTestId(imgTestId)).not.toBeInTheDocument();

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
				expect(container.querySelector('[aria-valuenow="50"]')).toBeInTheDocument();
				expect(container.querySelector('[data-test-progress="0.5"]')).toBeInTheDocument();

				// set timers back to normal
				jest.runOnlyPendingTimers();
				jest.useRealTimers();
			});

			it('when successfully being processed after uploading without a local preview', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { MockedMediaClientProvider, uploadItem, processItem } =
					createMockedMediaClientProvider({
						initialItems: fileItem,
					});

				uploadItem(fileItem, 0.5);

				const { container } = render(
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
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="uploading"]')).toBeInTheDocument(),
				);

				uploadItem(fileItem, 1);
				processItem(fileItem, 1);

				// simulate that the file has been fully loaded by the browser
				const img = await screen.findByTestId(imgTestId);
				fireEvent.load(img);

				// card should be fully processeds
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
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
				expect(container.querySelector('[data-test-progress="1"]')).toBeInTheDocument();
			});

			it('when uploading with a local preview', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
				const { MockedMediaClientProvider, uploadItem } = createMockedMediaClientProvider({
					initialItems: fileItem,
				});

				uploadItem(fileItem, 0.8);

				const { container } = render(
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
				expect(container.querySelector('[aria-valuenow="80"]')).toBeInTheDocument();
				expect(container.querySelector('[data-test-progress="0.8"]')).toBeInTheDocument();
			});

			it('when successfully being processed after uploading with a local preview', async () => {
				// using Jest's useFakeTimers to accelerate the polling function
				jest.useFakeTimers();

				const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
				const { MockedMediaClientProvider, uploadItem, processItem } =
					createMockedMediaClientProvider({
						initialItems: fileItem,
					});

				uploadItem(fileItem, 0.5);

				const { container } = render(
					<MockedMediaClientProvider>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
							disableOverlay
						/>
					</MockedMediaClientProvider>,
				);

				await waitFor(() =>
					expect(container.querySelector('[data-test-status="uploading"]')).toBeInTheDocument(),
				);

				uploadItem(fileItem, 1);
				processItem(fileItem, 1);

				jest.runAllTimers();

				// simulate that the file has been fully loaded by the browser
				const img = await screen.findByTestId(imgTestId);
				fireEvent.load(img);

				// card should be fully processed
				await waitFor(
					() =>
						expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
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
				expect(container.querySelector('[data-test-progress="1"]')).toBeInTheDocument();

				// set timers back to normal
				jest.runOnlyPendingTimers();
				jest.useRealTimers();
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

				// should never render an image
				await expect(screen.findByTestId(imgTestId)).rejects.toThrow();

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

				const { container } = render(
					<MockedMediaClientProvider>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
							disableOverlay
						/>
					</MockedMediaClientProvider>,
				);

				await waitFor(() =>
					expect(container.querySelector('[data-test-status="uploading"]')).toBeInTheDocument(),
				);

				uploadItem(fileItem, 'error');

				await waitFor(() =>
					expect(container.querySelector('[data-test-status="error"]')).toBeInTheDocument(),
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

				const { container } = render(
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
				fireEvent.load(img);

				// card should completely process
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
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
				await expect(
					waitFor(() =>
						expect(container.querySelector('[data-test-status="error"]')).toBeInTheDocument(),
					),
				).rejects.toThrow();

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
			const { container } = render(
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
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(() =>
				expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
			);

			const playBtn = screen.getByLabelText('play');
			await user.click(playBtn);
			expect(container.querySelector('video')).toBeInTheDocument();
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

			const { container } = render(
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
			await waitFor(() =>
				expect(container.querySelector('[data-test-status="error"]')).toBeInTheDocument(),
			);

			expect(screen.queryByLabelText('play')).not.toBeInTheDocument();
			expect(container.querySelector('video')).not.toBeInTheDocument();
		});
	});

	describe('should update when a new identifier is provided', () => {
		it('for a new file identifier', async () => {
			global.URL.createObjectURL = () => 'create-object-url-1';

			const [fileItem1, identifier1] = generateSampleFileItem.workingPdfWithRemotePreview();
			const [fileItem2, identifier2] = generateSampleFileItem.workingJpegWithRemotePreview();
			const { mediaApi } = createMockedMediaApi([fileItem1, fileItem2]);

			const { container, rerender } = render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier1}
						isLazy={false}
					/>
				</MockedMediaClientProvider>,
			);

			// simulate that the file has been fully loaded by the browser
			const img = await screen.findByTestId(imgTestId);
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(() =>
				expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
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
			fireEvent.load(newImg);

			// card should completely process the file
			await waitFor(() =>
				expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
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
			const { container, rerender } = render(
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
			const img = await screen.findByTestId(imgTestId);
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(() =>
				expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
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
			fireEvent.load(newImg);

			// card should completely process the file
			await waitFor(() =>
				expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
			);

			expect(screen.getByText(newExtIdentifier.name)).toBeInTheDocument();
			expect((newImg as HTMLImageElement).src).toContain(newExtIdentifier.dataURI);
		});
	});

	it('should trigger download action successfully when clicked', async () => {
		const [fileItem, identifier] = generateSampleFileItem.failedPdf();
		const { mediaApi } = createMockedMediaApi(fileItem);

		const user = userEvent.setup();

		const { container } = render(
			<MockedMediaClientProvider mockedMediaApi={mediaApi}>
				<CardLoader
					mediaClientConfig={dummyMediaClientConfig}
					identifier={identifier}
					isLazy={false}
				/>
			</MockedMediaClientProvider>,
		);

		// card should completely process the error
		await waitFor(() =>
			expect(container.querySelector('[data-test-status="failed-processing"]')).toBeInTheDocument(),
		);

		const btn = screen.getByLabelText('Download');
		await user.click(btn);
		expect(globalMediaEventEmitter.emit).toHaveBeenCalledTimes(1);
		expect(globalMediaEventEmitter.emit).toHaveBeenCalledWith('media-viewed', {
			fileId: fileItem.id,
			isUserCollection: false,
			viewingLevel: 'download',
		});
	});

	describe('should manage MediaViewer integration', () => {
		it('should render Media Viewer when clicked when "shouldOpenMediaViewer" is true', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			const user = userEvent.setup();

			const { container } = render(
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
			await waitFor(() =>
				expect(container.querySelector('[data-test-status="loading-preview"]')).toBeInTheDocument(),
			);

			// simulate that the file has been fully loaded by the browser
			const img = await screen.findByTestId(imgTestId);
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(() =>
				expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
			);

			const card = screen.getByTestId(cardTestId);
			await user.click(card);
			expect(await screen.findByTestId(mediaViewerTestId)).toBeInTheDocument();
		});

		it('should not render Media Viewer when clicked when "shouldOpenMediaViewer" is false by default', async () => {
			const user = userEvent.setup();
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			const { container } = render(
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
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(() =>
				expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
			);

			const card = screen.getByTestId(cardTestId);
			await user.click(card);
			await expect(screen.findByTestId(mediaViewerTestId)).rejects.toThrow();
		});

		/**
		 * TODO - Media Viewer (MV) won't work at the moment because it isn't using the media-state state.
		 * As such, this test cases doesn't really check that MV renders with all items.
		 * Instead, it checks that at the very least, the first and only item is the card that was clicked upon.
		 * Need to update these this test case in the future
		 */
		it('should render Media Viewer with an item', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			const user = userEvent.setup();

			const { container } = render(
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
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(() =>
				expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
			);

			const card = screen.getByTestId(cardTestId);
			await user.click(card);

			const mediaViewer = await screen.findByTestId(mediaViewerTestId);
			expect(mediaViewer).toBeInTheDocument();

			expect(within(mediaViewer).getByText(fileItem.details.name)).toBeInTheDocument();
		});

		it('should open the media viewer when button is clicked and focus button when closed', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			const user = userEvent.setup();

			const { container } = render(
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
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(() =>
				expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
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
			const { container } = render(
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
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(() =>
				expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
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
		const { container } = render(
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
		fireEvent.load(img);

		// card should completely process the file
		await waitFor(() =>
			expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
		);

		expect(screen.getByText(extIdentifier.name)).toBeInTheDocument();
		expect((img as HTMLImageElement).src).toContain(extIdentifier.dataURI);
	});

	describe('should trigger events from globalMediaEventEmitter', () => {
		it('when rendering an image not from the recents collection, it should emit a "media-viewed" event', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			const { container } = render(
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
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(() =>
				expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
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

			const { container } = render(
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
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(() =>
				expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
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
			const { container } = render(
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
			fireEvent.load(img);

			// card should completely process the file
			await waitFor(() =>
				expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
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

		const { container } = render(
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
		await waitFor(() =>
			expect(container.querySelector('[data-test-status="error"]')).toBeInTheDocument(),
		);

		expect(screen.getByText('an internationalised message')).toBeInTheDocument();
	});

	describe('should manage analytics appropriately', () => {
		describe('should pass the Analytics Event fired', () => {
			it('from CardView to the provided onClick callback', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);

				const user = userEvent.setup();
				const onClick = jest.fn();
				const { container } = render(
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
				fireEvent.load(img);

				// card should completely process the file
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
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
				const { container } = render(
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
				fireEvent.load(img);

				// card should completely process the file
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
				);

				const card = screen.getByTestId(cardTestId);
				await user.click(card);
				expect(onClick.mock.calls[0][1]).toBeDefined();
			});
		});

		describe('should fire commenced analytics event on file load start ', () => {
			it('with file identifier', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);

				const { container } = render(
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
				fireEvent.load(img);

				// card should completely process the file
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
				);

				expect(fireCommencedEvent).toBeCalledTimes(1);
				expect(fireCommencedEvent).toHaveBeenCalledWith(
					expect.any(Function),
					expect.objectContaining({
						fileId: fileItem.id,
					}),
					{ overall: { durationSincePageStart: PERFORMANCE_NOW } },
					{
						traceId: expect.any(String),
					},
				);
			});

			it('with an external image identifier', async () => {
				const { mediaApi } = createMockedMediaApi();
				const extIdentifier = {
					mediaItemType: 'external-image',
					dataURI: 'ext-uri',
					name: 'ext',
				} as const;
				const { container } = render(
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
				fireEvent.load(img);

				// card should completely process the file
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
				);

				expect(fireCommencedEvent).toBeCalledTimes(1);
				expect(fireCommencedEvent).toHaveBeenCalledWith(
					expect.any(Function),
					expect.objectContaining({
						fileId: 'external-image',
					}),
					{ overall: { durationSincePageStart: PERFORMANCE_NOW } },
					{
						traceId: expect.any(String),
					},
				);
			});
		});

		describe('should attach the correct file status flags when completing the UFO experience', () => {
			it('should attach an uploading file status flag with value as true', async () => {
				// using Jest's useFakeTimers to accelerate the polling function
				jest.useFakeTimers();

				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { uploadItem, processItem, MockedMediaClientProvider } =
					createMockedMediaClientProvider({
						initialItems: fileItem,
					});

				uploadItem(fileItem, 0);

				const { container } = render(
					<MockedMediaClientProvider>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				await waitFor(() =>
					expect(container.querySelector('[data-test-status="uploading"]')).toBeInTheDocument(),
				);

				uploadItem(fileItem, 1);
				processItem(fileItem, 1);

				jest.runAllTimers();

				// simulate that the file has been fully loaded by the browser

				const img = await screen.findByTestId(imgTestId, undefined);
				fireEvent.load(img);

				// card should completely process the file
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
				);
				expect(completeUfoExperience).toBeCalledTimes(4);
				expect(completeUfoExperience).toHaveBeenLastCalledWith(
					expect.any(String),
					expect.any(String),
					expect.any(Object),
					{ wasStatusUploading: true, wasStatusProcessing: true },
					expect.any(Object),
					undefined,
				);

				// set timers back to normal
				jest.runOnlyPendingTimers();
				jest.useRealTimers();
			});

			it('should attach a processing file status flag with value as true', async () => {
				// using Jest's useFakeTimers to accelerate the polling function
				jest.useFakeTimers();

				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { processItem, MockedMediaClientProvider } = createMockedMediaClientProvider({
					initialItems: fileItem,
				});

				processItem(fileItem, 0);

				const { container } = render(
					<MockedMediaClientProvider>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// card should be attempting to loading the file state
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="processing"]')).toBeInTheDocument(),
				);

				processItem(fileItem, 1);

				jest.runAllTimers();

				// simulate that the file has been fully loaded by the browser

				const img = await screen.findByTestId(imgTestId, undefined);
				fireEvent.load(img);

				// card should completely process the file
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
				);
				expect(completeUfoExperience).toBeCalledTimes(3);
				expect(completeUfoExperience).toHaveBeenLastCalledWith(
					expect.any(String),
					expect.any(String),
					expect.any(Object),
					{ wasStatusUploading: false, wasStatusProcessing: true },
					expect.any(Object),
					undefined,
				);

				// set timers back to normal
				jest.runOnlyPendingTimers();
				jest.useRealTimers();
			});

			it('should attach uploading and processing file status flags with values as false', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);

				const { container } = render(
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
				fireEvent.load(img);

				// card should completely process the file
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
				);
				expect(completeUfoExperience).toBeCalledTimes(2);
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
				const { container } = render(
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
				fireEvent.load(img);

				// card should completely process the file
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
				);
				expect(completeUfoExperience).toBeCalledTimes(1);
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

				const { container } = render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// card should completely process the error
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="error"]')).toBeInTheDocument(),
				);

				expect(completeUfoExperience).toBeCalledTimes(1);
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
					new MediaCardError(
						'metadata-fetch',
						new MediaFileStateError(fileItem.id, 'serverRateLimited', undefined, {
							statusCode: 429,
						}),
					),
				);
				expect((completeUfoExperience as jest.Mock).mock.calls[0][5].secondaryError).toMatchObject({
					id: fileItem.id,
					reason: 'serverRateLimited',
					details: { statusCode: 429 },
				});
			});

			it('when a pollingMaxAttemptsExceeded error occurs (PollingError: pollingMaxAttemptsExceeded)', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);

				mediaApi.getItems = () => {
					throw createPollingMaxAttemptsError(2);
				};

				const { container } = render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// card should completely process the error
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="error"]')).toBeInTheDocument(),
				);

				expect(completeUfoExperience).toBeCalledTimes(1);
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
					new MediaCardError(
						'metadata-fetch',
						new MediaFileStateError(fileItem.id, 'pollingMaxAttemptsExceeded', undefined, {
							attempts: 2,
						}),
					),
				);
				expect((completeUfoExperience as jest.Mock).mock.calls[0][5].secondaryError).toMatchObject({
					id: fileItem.id,
					reason: 'pollingMaxAttemptsExceeded',
					details: { attempts: 2 },
				});
			});
		});

		describe('should fire a screen event ', () => {
			it('when the file status is complete', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);

				const { container } = render(
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
				fireEvent.load(img);

				// card should completely process the file
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
				);

				expect(fireScreenEvent).toBeCalledTimes(1);
			});

			it('when the file is a video and has a preview', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingVideo();
				const { mediaApi } = createMockedMediaApi(fileItem);

				const { container } = render(
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
				fireEvent.load(img);

				// card should completely process the file
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
				);

				expect(fireScreenEvent).toBeCalledTimes(1);
			});
		});

		describe('should fire an operational event', () => {
			it('when the card status changes (file identifier)', async () => {
				// using Jest's useFakeTimers to accelerate the polling function
				jest.useFakeTimers();

				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { MockedMediaClientProvider, processItem } = createMockedMediaClientProvider({
					initialItems: fileItem,
				});

				processItem(fileItem, 0);

				const { container } = render(
					<MockedMediaClientProvider>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				await waitFor(() =>
					expect(container.querySelector('[data-test-status="processing"]')).toBeInTheDocument(),
				);

				processItem(fileItem, 1);

				jest.runAllTimers();

				// simulate that the file has been fully loaded by the browser
				const img = await screen.findByTestId(imgTestId, undefined);
				fireEvent.load(img);

				// card should completely process the file
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
				);

				expect(fireOperationalEvent).toHaveBeenCalledTimes(3);
				expect(fireOperationalEvent).toHaveBeenNthCalledWith(
					1,
					expect.any(Function),
					'processing',
					{
						fileMediatype: fileItem.details.mediaType,
						fileMimetype: fileItem.details.mimeType,
						fileId: fileItem.id,
						fileSize: fileItem.details.size,
						fileStatus: 'processing',
					},
					{
						overall: {
							durationSinceCommenced: 0,
							durationSincePageStart: PERFORMANCE_NOW,
						},
					},
					{ client: { status: 'unknown' }, server: { status: 'unknown' } },
					undefined,
					{
						traceId: expect.any(String),
					},
					{ spanId: expect.any(String), traceId: expect.any(String) },
				);
				expect(fireOperationalEvent).toHaveBeenNthCalledWith(
					3,
					expect.any(Function),
					'complete',
					{
						fileMediatype: fileItem.details.mediaType,
						fileMimetype: fileItem.details.mimeType,
						fileId: fileItem.id,
						fileSize: fileItem.details.size,
						fileStatus: 'processed',
					},
					{
						overall: {
							durationSinceCommenced: 0,
							durationSincePageStart: PERFORMANCE_NOW,
						},
					},
					{ client: { status: 'unknown' }, server: { status: 'unknown' } },
					undefined,
					{
						traceId: expect.any(String),
					},
					{ spanId: expect.any(String), traceId: expect.any(String) },
				);

				// set timers back to normal
				jest.runOnlyPendingTimers();
				jest.useRealTimers();
			});

			it('when the card status changes (external image identifier)', async () => {
				const { mediaApi } = createMockedMediaApi();
				const extIdentifier = {
					mediaItemType: 'external-image',
					dataURI: 'ext-uri',
					name: 'ext',
				} as const;
				const { container } = render(
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
				fireEvent.load(img);

				// card should completely process the file
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
				);

				expect(fireOperationalEvent).toHaveBeenCalledTimes(1);
				expect(fireOperationalEvent).toHaveBeenCalledWith(
					expect.any(Function),
					'complete',
					{
						fileMediatype: 'image',
						fileId: extIdentifier.mediaItemType,
					},
					{
						overall: {
							durationSinceCommenced: 0,
							durationSincePageStart: PERFORMANCE_NOW,
						},
					},
					{ client: { status: 'unknown' }, server: { status: 'unknown' } },
					undefined,
					{
						traceId: expect.any(String),
					},
					undefined,
				);
			});

			it('when a serverRateLimited error occurs (RequestError: serverRateLimited)', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);

				mediaApi.getItems = () => {
					throw createRateLimitedError();
				};

				const { container } = render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// card should completely process the error
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="error"]')).toBeInTheDocument(),
				);

				expect(fireOperationalEvent).toBeCalledTimes(1);
				expect(fireOperationalEvent).toHaveBeenLastCalledWith(
					expect.any(Function),
					'error',
					{
						fileMediatype: undefined,
						fileMimetype: undefined,
						fileId: fileItem.id,
						fileSize: undefined,
						fileStatus: undefined,
					},
					{
						overall: {
							durationSinceCommenced: 0,
							durationSincePageStart: PERFORMANCE_NOW,
						},
					},
					{ client: { status: 'unknown' }, server: { status: 'unknown' } },
					new MediaCardError(
						'metadata-fetch',
						new MediaFileStateError(fileItem.id, 'serverRateLimited', undefined, {
							statusCode: 429,
						}),
					),
					{
						traceId: expect.any(String),
					},
					undefined,
				);
				expect((fireOperationalEvent as jest.Mock).mock.calls[0][5].secondaryError).toMatchObject({
					id: fileItem.id,
					reason: 'serverRateLimited',
					details: { statusCode: 429 },
				});
			});

			it('when a pollingMaxAttemptsExceeded error occurs (PollingError: pollingMaxAttemptsExceeded)', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);

				mediaApi.getItems = () => {
					throw createPollingMaxAttemptsError(2);
				};

				const { container } = render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
						/>
					</MockedMediaClientProvider>,
				);

				// card should completely process the error
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="error"]')).toBeInTheDocument(),
				);

				expect(fireOperationalEvent).toBeCalledTimes(1);
				expect(fireOperationalEvent).toHaveBeenLastCalledWith(
					expect.any(Function),
					'error',
					{
						fileMediatype: undefined,
						fileMimetype: undefined,
						fileId: fileItem.id,
						fileSize: undefined,
						fileStatus: undefined,
					},
					{
						overall: {
							durationSinceCommenced: 0,
							durationSincePageStart: PERFORMANCE_NOW,
						},
					},
					{ client: { status: 'unknown' }, server: { status: 'unknown' } },
					new MediaCardError(
						'metadata-fetch',
						new MediaFileStateError(fileItem.id, 'pollingMaxAttemptsExceeded', undefined, {
							attempts: 2,
						}),
					),
					{
						traceId: expect.any(String),
					},
					undefined,
				);
				expect((fireOperationalEvent as jest.Mock).mock.calls[0][5].secondaryError).toMatchObject({
					id: fileItem.id,
					reason: 'pollingMaxAttemptsExceeded',
					details: { attempts: 2 },
				});
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

			const { container } = render(
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
			await waitFor(() =>
				expect(container.querySelector('[data-test-status="loading"]')).toBeInTheDocument(),
			);
			makeVisible();

			await waitFor(() => expect(fireNonCriticalErrorEvent).toBeCalledTimes(1));
			expect(fireNonCriticalErrorEvent).toBeCalledWith(
				expect.any(Function),
				expect.any(String),
				expect.any(Object),
				expect.any(Object),
				expect.objectContaining({
					primaryReason: 'remote-preview-fetch',
				}),
				expect.any(Object),
				expect.any(Object),
			);

			const img: HTMLImageElement = await screen.findByTestId(imgTestId);
			expect(img).toBeInTheDocument();
			expect(img.src).toContain('global-scope-datauri');
		});

		describe('should abort the experience', () => {
			it('when the component is unmounted (file identifier)', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);

				const { container, unmount } = render(
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
				fireEvent.load(img);

				// card should completely process the file
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
				);

				unmount();
				expect(abortUfoExperience).toBeCalledTimes(1);
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

				const { container, unmount } = render(
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
				fireEvent.load(img);

				// card should completely process the file
				await waitFor(() =>
					expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
				);

				unmount();
				expect(abortUfoExperience).toBeCalledTimes(1);
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

	ffTest.on('platform.media-card-svg-rendering_6tdbv', 'SVG', () => {
		it('should render SVG natively when the overlay is disbled', async () => {
			const [fileItem, identifier] = generateSampleFileItem.svg();
			const { mediaApi } = createMockedMediaApi(fileItem);

			const { findAllByTestId, container } = render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
						disableOverlay
					/>
				</MockedMediaClientProvider>,
			);

			const elem = await findAllByTestId('media-card-svg');
			expect(elem[0]).toBeDefined();
			const imgElement = elem[0];
			expect(imgElement.nodeName.toLowerCase()).toBe('img');
			fireEvent.load(imgElement);

			await waitFor(() =>
				expect(container.querySelector('[data-test-status="complete"]')).toBeInTheDocument(),
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
			mediaApi.getFileBinary = () => {
				throw createServerUnauthorizedError();
			};

			const { container } = render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
						disableOverlay
					/>
				</MockedMediaClientProvider>,
			);

			await waitFor(() =>
				expect(container.querySelector('[data-test-status="error"]')).toBeInTheDocument(),
			);

			const fileAttributes = {
				fileId: identifier.id,
				fileMediatype: fileItem.details.mediaType,
				fileMimetype: fileItem.details.mimeType,
				fileSize: fileItem.details.size,
				fileStatus: 'processed',
			};

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

		it('should render error screen when image tag fails to render the file', async () => {
			const [fileItem, identifier] = generateSampleFileItem.svg();
			const { mediaApi } = createMockedMediaApi(fileItem);

			const { findAllByTestId, container } = render(
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<CardLoader
						mediaClientConfig={dummyMediaClientConfig}
						identifier={identifier}
						isLazy={false}
						disableOverlay
					/>
				</MockedMediaClientProvider>,
			);

			const elem = await findAllByTestId('media-card-svg');
			expect(elem[0]).toBeDefined();
			const imgElement = elem[0];
			expect(imgElement.nodeName.toLowerCase()).toBe('img');
			fireEvent.error(imgElement);

			await waitFor(() =>
				expect(container.querySelector('[data-test-status="error"]')).toBeInTheDocument(),
			);

			const fileAttributes = {
				fileId: identifier.id,
				fileMediatype: fileItem.details.mediaType,
				fileMimetype: fileItem.details.mimeType,
				fileSize: fileItem.details.size,
				fileStatus: 'processed',
			};

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

				const { findAllByTestId } = render(
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<CardLoader
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
							disableOverlay
						/>
					</MockedMediaClientProvider>,
				);

				const elem = await findAllByTestId('media-card-svg');
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
