import Heading from '@atlaskit/heading';
import '@atlaskit/link-test-helpers/jest';
import {
	setup,
	setupEventPropagationTest,
	type SetUpParams,
	userEventOptionsWithAdvanceTimers,
} from './common/setup.test-utils';
import {
	HoverCard as StandaloneHoverCard,
	type HoverCardProps,
} from '@atlaskit/smart-card/hover-card';
import { type HoverCardInternalProps } from '../types';
import { forbiddenViewTests, mockUrl, runCommonHoverCardTests } from './common/common.test-utils';
import { analyticsTests } from './common/analytics.test-utils';
import { mockConfluenceResponse } from './__mocks__/mocks';
import { fakeFactory } from '../../../utils/mocks';
import userEvent from '@testing-library/user-event';
import React, { useState } from 'react';
import { IntlProvider } from 'react-intl-next';
import { Provider } from '@atlaskit/smart-card';
import { act, render } from '@testing-library/react';
import { HoverCard } from '../index';
import * as useSmartCardActions from '../../../state/actions';

const TestCanOpenComponent = ({
	canOpen: canOpenOption,
	testId,
}: {
	canOpen?: boolean;
	testId: string;
}) => {
	const mockFetch = jest.fn(() => Promise.resolve(mockConfluenceResponse));
	const mockClient = new (fakeFactory(mockFetch))();
	const [canOpen, setCanOpen] = useState(canOpenOption);

	return (
		<Provider client={mockClient}>
			<HoverCard url={mockUrl} id="some-id" canOpen={canOpen}>
				<div>
					<div data-testid={testId}>Hover and find out</div>
					<div data-testid={`${testId}-can-open`} onMouseEnter={() => setCanOpen(true)}>
						Hover to open
					</div>
					<div data-testid={`${testId}-cannot-open`} onMouseEnter={() => setCanOpen(false)}>
						Hover to hide
					</div>
				</div>
			</HoverCard>
		</Provider>
	);
};

describe('standalone hover card', () => {
	beforeEach(() => {
		jest.useFakeTimers({ legacyFakeTimers: true });
	});

	afterEach(() => {
		act(() => jest.runAllTimers()); // Suppress act errors after test ends
		jest.useRealTimers();
		jest.restoreAllMocks();
	});

	const childTestId = 'hover-test-div';
	const secondaryChildTestId = 'secondary-child-test-id';

	const standaloneSetUp = async (
		setUpParams?: SetUpParams,
		props?: Partial<HoverCardProps & HoverCardInternalProps>,
	) => {
		const hoverCardComponent = (
			<StandaloneHoverCard url={mockUrl} {...setUpParams?.extraCardProps} {...props}>
				<div data-testid={childTestId}>
					<Heading testId={secondaryChildTestId} size="large">
						Hover on me
					</Heading>
				</div>
			</StandaloneHoverCard>
		);

		return await setup({
			testId: childTestId,
			component: hoverCardComponent,
			...setUpParams,
		});
	};

	const testConfig = {
		testIds: {
			secondaryChildTestId: 'secondary-child-test-id',
			unauthorizedTestId: 'hover-test-div',
			erroredTestId: 'hover-test-div',
		},
	};

	describe('Common tests', () => {
		runCommonHoverCardTests((setupProps?: SetUpParams) => standaloneSetUp(setupProps), testConfig);
		forbiddenViewTests((setupProps?: SetUpParams) => standaloneSetUp(setupProps));
		analyticsTests((setupProps?: SetUpParams) => standaloneSetUp(setupProps), {
			display: undefined,
			isAnalyticsContextResolvedOnHover: false,
		});
	});

	it('should render a correct view of a hover card over a div', async () => {
		const { findAllByTestId, findByTestId } = await standaloneSetUp();
		const titleBlock = await findByTestId('smart-block-title-resolved-view');
		await findAllByTestId('smart-block-metadata-resolved-view');
		const snippetBlock = await findByTestId('smart-block-snippet-resolved-view');
		const footerBlock = await findByTestId('smart-ai-footer-block-resolved-view');
		// trim because the icons are causing new lines in the textContent
		expect(titleBlock.textContent?.trim()).toBe('I love cheese');
		expect(snippetBlock.textContent).toBe('Here is your serving of cheese');
		expect(footerBlock.textContent?.trim()).toBe('Confluence');
	});

	it('should clear up timeout if the component unmounts before the hover card shows up', async () => {
		const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
		const testId = 'h1-hover-card-trigger';
		const mockFetch = jest.fn(() => Promise.resolve(mockConfluenceResponse));
		const mockClient = new (fakeFactory(mockFetch))();
		const event = userEvent.setup({ delay: null });

		const ComponentWithHoverCard = () => {
			return (
				<StandaloneHoverCard url={mockUrl} id={'1234'}>
					<Heading testId={testId} size="xlarge">
						Hover over me!
					</Heading>
				</StandaloneHoverCard>
			);
		};

		const FirstRenderComponent = () => (
			<div data-testid="first">
				<ComponentWithHoverCard />
			</div>
		);

		const SecondRenderComponent = () => (
			<div data-testid="second">
				<ComponentWithHoverCard />
			</div>
		);

		const SetUp = () => {
			const [hasHovered, setHasHovered] = useState(false);

			const handleOnMouseOver = () => {
				setHasHovered(true);
			};

			return (
				<div>
					<IntlProvider locale="en">
						<Provider client={mockClient}>
							<div onMouseOver={handleOnMouseOver}>
								{!hasHovered ? <FirstRenderComponent /> : <SecondRenderComponent />}
							</div>
						</Provider>
					</IntlProvider>
				</div>
			);
		};

		const { findByTestId } = render(<SetUp />);

		// should render the first component on the first render.
		const firstComponent = await findByTestId('first');
		expect(firstComponent).toBeDefined();

		const componentWithHoverCard = await findByTestId('hover-card-trigger-wrapper');
		expect(componentWithHoverCard).toBeDefined();

		// this should trigger the HoverCard mount for the first component
		// along with unmount of the first component and the mount of the second component
		await event.hover(componentWithHoverCard);

		const secondComponent = await findByTestId('second');
		expect(secondComponent).toBeDefined();

		// making sure that error "Can't perform a React state update on an unmounted component" is not shown in the console
		const isUnmountErrorMessagePresent = consoleSpy.mock.calls.some((callArgs) =>
			callArgs.some((arg) =>
				arg.includes("Can't perform a React state update on an unmounted component"),
			),
		);

		expect(isUnmountErrorMessagePresent).toBeFalsy();
	});

	describe('event propagation', () => {
		const renderComponent = async (params: Parameters<typeof setupEventPropagationTest>[0]) => {
			const testId = 'hover-test-div';
			const component = (
				<IntlProvider locale="en">
					<StandaloneHoverCard url={mockUrl} id="some-id">
						<div data-testid={testId}>Hover on me</div>
					</StandaloneHoverCard>
				</IntlProvider>
			);

			return await setupEventPropagationTest({
				component,
				testId,
				...params,
			});
		};

		it('does not propagate event to parent when clicking inside hover card content', async () => {
			const mockOnClick = jest.fn();
			const { findByTestId, event } = await renderComponent({
				mockOnClick,
			});

			const content = await findByTestId('smart-links-container');
			await event.click(content);

			const link = await findByTestId('smart-element-link');
			await event.click(link);

			const previewButton = await findByTestId('smart-action-preview-action');
			await event.click(previewButton);

			expect(mockOnClick).not.toHaveBeenCalled();
		});

		it('does not propagate event to parent when clicking on trigger element', async () => {
			const mockOnClick = jest.fn();
			const { element, event } = await renderComponent({ mockOnClick });

			await event.click(element);

			expect(mockOnClick).not.toHaveBeenCalled();
		});
	});

	describe('starts resolving a link after 100ms on hover', () => {
		let loadMetadataSpy = jest.fn();

		beforeEach(() => {
			loadMetadataSpy = jest.fn();

			const mockedActions = {
				authorize: jest.fn(),
				invoke: jest.fn(),
				register: jest.fn(),
				reload: jest.fn(),
				loadMetadata: loadMetadataSpy,
			};

			jest
				.spyOn(useSmartCardActions, 'useSmartCardActions')
				.mockImplementation(() => mockedActions);
		});

		it('should not call loadMetadata if mouseLeave is fired before the delay runs out', async () => {
			const { findByTestId, event } = await standaloneSetUp({
				userEventOptions: userEventOptionsWithAdvanceTimers,
			});

			// Delay not completed yet
			act(() => {
				jest.advanceTimersByTime(99);
			});
			expect(loadMetadataSpy).not.toHaveBeenCalled();

			// Delay completed
			const triggerArea = await findByTestId('hover-card-trigger-wrapper');
			await event.unhover(triggerArea);

			act(() => {
				jest.advanceTimersByTime(1);
			});
			expect(loadMetadataSpy).not.toHaveBeenCalled();
		});

		it('should call loadMetadata if mouseLeave is fired before the delay runs out but then the mouse enters again and waits for 100ms', async () => {
			const { findByTestId, event } = await standaloneSetUp({
				userEventOptions: userEventOptionsWithAdvanceTimers,
			});

			// Hovering on the hover area for the first time and then moving the mouse before the 100 ms elapses
			act(() => {
				jest.advanceTimersByTime(99);
			});
			expect(loadMetadataSpy).not.toHaveBeenCalled();

			const triggerArea = await findByTestId('hover-card-trigger-wrapper');
			await event.unhover(triggerArea);

			// Making sure the loadMetadata was not called
			act(() => {
				jest.advanceTimersByTime(1);
			});
			expect(loadMetadataSpy).not.toHaveBeenCalled();

			// Hover on the hover area for the second time and waiting for 100ms
			await event.hover(triggerArea);
			act(() => {
				jest.advanceTimersByTime(100);
			});

			// Making sure the loadMetadata was called
			expect(loadMetadataSpy).toHaveBeenCalled();
		});

		it('should call loadMetadata after a delay if link state is pending', async () => {
			const { findByTestId, event } = await standaloneSetUp({
				userEventOptions: userEventOptionsWithAdvanceTimers,
			});

			const triggerArea = await findByTestId('hover-card-trigger-wrapper');
			expect(triggerArea).toBeDefined();

			await event.hover(triggerArea);

			// Delay not completed yet
			act(() => {
				jest.advanceTimersByTime(99);
			});

			expect(loadMetadataSpy).not.toHaveBeenCalled();

			// Delay completed
			act(() => {
				jest.advanceTimersByTime(1);
			});

			expect(loadMetadataSpy).toHaveBeenCalled();
		});

		it('should call loadMetadata only once if multiple mouseOver events are sent and if link state is pending', async () => {
			const { findByTestId, event } = await standaloneSetUp({
				userEventOptions: userEventOptionsWithAdvanceTimers,
			});

			const triggerArea = await findByTestId('hover-card-trigger-wrapper');
			expect(triggerArea).toBeDefined();

			// Firing the first mouseOver event
			await event.hover(triggerArea);

			// Delay not completed yet
			act(() => {
				jest.advanceTimersByTime(1);
			});

			// Firing the second mouseOver event
			await event.hover(triggerArea);

			// Delay completed
			act(() => {
				jest.advanceTimersByTime(99);
			});

			expect(loadMetadataSpy).toHaveBeenCalledTimes(1);
		});
	});

	describe('internal hover card props', () => {
		describe('closeOnChildClick', () => {
			it.each<['should' | 'should not', boolean]>([
				['should', true],
				['should not', false],
			])(
				'%s close hoverCard when a user clicks on a child when closeOnChildClick is %s',
				async (outcome, closeOnChildClick) => {
					const testId = 'hover-test-div';

					const { findByTestId, queryByTestId, event } = await standaloneSetUp(undefined, {
						closeOnChildClick,
					});

					expect(await findByTestId('hover-card')).toBeDefined();
					await event.click(await findByTestId(testId));

					if (outcome === 'should') {
						expect(queryByTestId('hover-card')).toBeNull();
					} else {
						expect(await findByTestId('hover-card')).toBeDefined();
					}
				},
			);
		});

		describe('noFadeDelay', () => {
			it('noFadeDelay should cancel fade in/out timeouts when is true', async () => {
				const { queryByTestId, findByTestId, event } = await standaloneSetUp(undefined, {
					noFadeDelay: true,
				});

				act(() => {
					jest.advanceTimersByTime(0); // No Fade In Delay
				});
				expect(await findByTestId('hover-card')).toBeInTheDocument();

				const triggerArea = await findByTestId('hover-card-trigger-wrapper');
				expect(triggerArea).toBeDefined();

				await act(async () => {
					await event.unhover(triggerArea);
					jest.advanceTimersByTime(0); // No Fade Out Delay
				});
				expect(queryByTestId('hover-card')).not.toBeInTheDocument();
			});

			it('noFadeDelay should not cancel fade in/out timeouts when is false', async () => {
				const { queryByTestId, findByTestId, event } = await standaloneSetUp(undefined, {
					noFadeDelay: false,
				});

				act(() => {
					jest.advanceTimersByTime(499);
				});
				expect(queryByTestId('hover-card')).toBeNull();

				act(() => {
					jest.advanceTimersByTime(1); // Fade In Delay completed
				});

				expect(queryByTestId('hover-card')).not.toBeNull();

				const triggerArea = await findByTestId('hover-card-trigger-wrapper');
				expect(triggerArea).toBeDefined();

				await event.unhover(triggerArea);

				act(() => {
					jest.advanceTimersByTime(299); // Fade Out Delay not completed yet
				});
				expect(queryByTestId('hover-card')).not.toBeNull();

				act(() => {
					jest.advanceTimersByTime(1); // Fade Out Delay completed
				});
				expect(queryByTestId('hover-card')).toBeNull();
			});
		});

		describe('can open', () => {
			const testId = 'hover-test-can-open-div';
			const contentTestId = 'smart-block-title-resolved-view';

			it.each<['should' | 'should not', boolean]>([
				['should', true],
				['should not', false],
			])('%s show hover card when canOpen is %s', async (outcome, canOpen) => {
				const { findByTestId, queryByTestId } = await setup({
					testId,
					component: <TestCanOpenComponent canOpen={canOpen} testId={testId} />,
				});
				if (outcome === 'should') {
					const hoverContent = await findByTestId(contentTestId);
					expect(hoverContent).toBeInTheDocument();
				} else {
					const hoverContent = queryByTestId(contentTestId);
					expect(hoverContent).not.toBeInTheDocument();
				}
			});

			it('show and hide hover card when at canOpen change value', async () => {
				const { findByTestId, queryByTestId, event } = await setup({
					testId,
					component: <TestCanOpenComponent testId={testId} />,
				});
				// Element has not set canOpen value (default)
				expect(await findByTestId(contentTestId)).toBeInTheDocument();
				// Element sets to can open
				const canOpenElement = await findByTestId(`${testId}-can-open`);
				await event.hover(canOpenElement);
				expect(await findByTestId(contentTestId)).toBeInTheDocument();
				// Element sets to cannot open
				const cannotOpenElement = await findByTestId(`${testId}-cannot-open`);
				await act(async () => {
					await event.hover(cannotOpenElement);
				});
				expect(queryByTestId(contentTestId)).not.toBeInTheDocument();
				// Go back to element sets to can open again
				const canOpenElementAgain = await findByTestId(`${testId}-can-open`);
				await event.hover(canOpenElementAgain);
				expect(await findByTestId(contentTestId)).toBeInTheDocument();
			});
		});

		describe('z-index', () => {
			it('renders with defaults z-index', async () => {
				const { findByTestId } = await standaloneSetUp();
				const hoverCard = await findByTestId('hover-card');
				const portal = hoverCard.closest('.atlaskit-portal');
				expect(portal).toHaveStyle('z-index: 510');
			});
			it('renders with provided z-index', async () => {
				const { findByTestId } = await standaloneSetUp(undefined, {
					zIndex: 10,
				});
				const hoverCard = await findByTestId('hover-card');
				const portal = hoverCard.closest('.atlaskit-portal');
				expect(portal).toHaveStyle('z-index: 10');
			});
		});

		describe('hidePreviewButton', () => {
			it('should not show the full screen view action if disabled via prop', async () => {
				const { findByTestId, queryByTestId } = await standaloneSetUp(undefined, {
					hidePreviewButton: true,
				});
				const footerBlock = await findByTestId('smart-ai-footer-block-resolved-view');
				expect(footerBlock).toBeTruthy();
				const fullscreenButton = queryByTestId('preview-content-button-wrapper');
				expect(fullscreenButton).toBeFalsy();
			});
		});
	});
});
