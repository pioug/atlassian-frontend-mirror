import '@atlaskit/link-test-helpers/jest';
import React, { useState } from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import Heading from '@atlaskit/heading';
import { SmartCardProvider as Provider } from '@atlaskit/link-provider';
import { CardAction } from '@atlaskit/smart-card';
import {
	type HoverCardProps,
	HoverCard as StandaloneHoverCard,
} from '@atlaskit/smart-card/hover-card';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import * as useSmartCardActions from '../../../state/actions';
import { fakeFactory } from '../../../utils/mocks';
import { HoverCard } from '../index';
import { type HoverCardInternalProps } from '../types';

import { mockConfluenceResponse } from './__mocks__/mocks';
import { analyticsTests } from './common/analytics.test-utils';
import { forbiddenViewTests, mockUrl, runCommonHoverCardTests } from './common/common.test-utils';
import {
	setup,
	setupEventPropagationTest,
	type SetUpParams,
	userEventOptionsWithAdvanceTimers,
} from './common/setup.test-utils';

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

const TestProductComponent = ({ testId = 'hover-trigger-test-id' }: { testId?: string }) => (
	<HoverCard url={mockUrl} id="some-id">
		<div data-testid={testId}>Hover</div>
	</HoverCard>
);

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

	it('should capture and report a11y violations', async () => {
		const testId = 'h1-hover-card-trigger';
		const mockFetch = jest.fn(() => Promise.resolve(mockConfluenceResponse));
		const mockClient = new (fakeFactory(mockFetch))();
		const ComponentWithHoverCard = () => (
			<StandaloneHoverCard url={mockUrl} id={'1234'}>
				<Heading testId={testId} size="xlarge">
					Hover over me!
				</Heading>
			</StandaloneHoverCard>
		);
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
		const { container } = render(<SetUp />);

		await expect(container).toBeAccessible();
	});

	it('should apply accessibility props to the hover card', async () => {
		await standaloneSetUp(undefined, {
			role: 'dialog',
			label: 'test-label',
			titleId: 'test-titleId',
		});

		const hoverCard = await screen.findByTestId('hover-card');

		expect(hoverCard).toHaveAttribute('role', 'dialog');
		expect(hoverCard).toHaveAttribute('aria-label', 'test-label');
		expect(hoverCard).toHaveAttribute('aria-labelledby', 'test-titleId');
	});

	it('should call onVisibilityChange when the hover card is visible or hidden', async () => {
		const onVisibilityChange = jest.fn();
		await standaloneSetUp(undefined, {
			onVisibilityChange,
			noFadeDelay: true,
		});
		const triggerWrapper = await screen.findByTestId('hover-card-trigger-wrapper');

		// Test showing the hover card
		fireEvent.mouseOver(triggerWrapper);
		expect(onVisibilityChange).toHaveBeenCalledWith(true);

		// Test hiding the hover card
		fireEvent.mouseLeave(triggerWrapper);
		expect(onVisibilityChange).toHaveBeenCalledWith(false);

		expect(onVisibilityChange).toHaveBeenCalledTimes(2);
	});

	it('should render a correct view of a hover card over a div', async () => {
		await standaloneSetUp();
		const titleBlock = await screen.findByTestId('smart-block-title-resolved-view');
		await screen.findAllByTestId('smart-block-metadata-resolved-view');
		const snippetBlock = await screen.findByTestId('smart-block-snippet-resolved-view');
		const footerBlock = await screen.findByTestId('smart-ai-footer-block-resolved-view');
		// trim because the icons are causing new lines in the textContent
		expect(titleBlock).toHaveTextContent(/I love cheese$/);
		expect(snippetBlock).toHaveTextContent('Here is your serving of cheese');
		expect(footerBlock).toHaveTextContent('Confluence');
	});

	it('should clear up timeout if the component unmounts before the hover card shows up', async () => {
		const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
		const testId = 'h1-hover-card-trigger';
		const mockFetch = jest.fn(() => Promise.resolve(mockConfluenceResponse));
		const mockClient = new (fakeFactory(mockFetch))();
		const event = userEvent.setup({ delay: null });

		const ComponentWithHoverCard = () => (
			<StandaloneHoverCard url={mockUrl} id={'1234'}>
				<Heading testId={testId} size="xlarge">
					Hover over me!
				</Heading>
			</StandaloneHoverCard>
		);

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

		render(<SetUp />);

		// should render the first component on the first render.
		const firstComponent = await screen.findByTestId('first');
		expect(firstComponent).toBeDefined();

		const componentWithHoverCard = await screen.findByTestId('hover-card-trigger-wrapper');
		expect(componentWithHoverCard).toBeDefined();

		// this should trigger the HoverCard mount for the first component
		// along with unmount of the first component and the mount of the second component
		await event.hover(componentWithHoverCard);

		const secondComponent = await screen.findByTestId('second');
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
			const { event } = await renderComponent({
				mockOnClick,
			});

			const content = await screen.findByTestId('smart-links-container');
			await event.click(content);

			const link = await screen.findByTestId('smart-element-link');
			await event.click(link);

			const previewButton = await screen.findByTestId('smart-action-preview-action');
			await event.click(previewButton);

			expect(mockOnClick).not.toHaveBeenCalled();
		});

		it('does not propagate event to parent when clicking on trigger element', async () => {
			const mockOnClick = jest.fn();
			const { element, event } = await renderComponent({ mockOnClick });

			await event.click(element);

			expect(mockOnClick).not.toHaveBeenCalled();
		});

		describe('allowEventPropagation prop', () => {
			const renderAllowEventPropagationTest = async (allowEventPropagation?: boolean) => {
				const mockOnClick = jest.fn();
				const testId = 'hover-test-div';

				const hoverCardProps: any = {
					url: mockUrl,
					id: 'some-id',
				};
				if (allowEventPropagation) {
					hoverCardProps.allowEventPropagation = allowEventPropagation;
				}

				const { element, event } = await setupEventPropagationTest({
					mockOnClick,
					component: (
						<IntlProvider locale="en">
							<StandaloneHoverCard {...hoverCardProps}>
								<div data-testid={testId}>Hover on me</div>
							</StandaloneHoverCard>
						</IntlProvider>
					),
					testId,
				});

				return { element, event, mockOnClick };
			};

			it('should prevent event propagation by default', async () => {
				const { element, event, mockOnClick } = await renderAllowEventPropagationTest();

				await event.click(element);

				expect(mockOnClick).not.toHaveBeenCalled();
			});

			it('should allow event propagation when set to true', async () => {
				const { element, event, mockOnClick } = await renderAllowEventPropagationTest(true);

				await event.click(element);

				expect(mockOnClick).toHaveBeenCalledTimes(1);
			});

			it('should prevent event propagation when explicitly set to false', async () => {
				const { element, event, mockOnClick } = await renderAllowEventPropagationTest(false);

				await event.click(element);

				expect(mockOnClick).not.toHaveBeenCalled();
			});
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
			const { event } = await standaloneSetUp({
				userEventOptions: userEventOptionsWithAdvanceTimers,
			});

			// Delay not completed yet
			act(() => {
				jest.advanceTimersByTime(99);
			});
			expect(loadMetadataSpy).not.toHaveBeenCalled();

			// Delay completed
			const triggerArea = await screen.findByTestId('hover-card-trigger-wrapper');
			await event.unhover(triggerArea);

			act(() => {
				jest.advanceTimersByTime(1);
			});
			expect(loadMetadataSpy).not.toHaveBeenCalled();
		});

		it('should call loadMetadata if mouseLeave is fired before the delay runs out but then the mouse enters again and waits for 100ms', async () => {
			const { event } = await standaloneSetUp({
				userEventOptions: userEventOptionsWithAdvanceTimers,
			});

			// Hovering on the hover area for the first time and then moving the mouse before the 100 ms elapses
			act(() => {
				jest.advanceTimersByTime(99);
			});
			expect(loadMetadataSpy).not.toHaveBeenCalled();

			const triggerArea = await screen.findByTestId('hover-card-trigger-wrapper');
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
			const { event } = await standaloneSetUp({
				userEventOptions: userEventOptionsWithAdvanceTimers,
			});

			const triggerArea = await screen.findByTestId('hover-card-trigger-wrapper');
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
			const { event } = await standaloneSetUp({
				userEventOptions: userEventOptionsWithAdvanceTimers,
			});

			const triggerArea = await screen.findByTestId('hover-card-trigger-wrapper');
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

					const { event } = await standaloneSetUp(undefined, {
						closeOnChildClick,
					});

					expect(await screen.findByTestId('hover-card')).toBeDefined();
					await event.click(await screen.findByTestId(testId));

					if (outcome === 'should') {
						expect(screen.queryByTestId('hover-card')).toBeNull();
					} else {
						expect(await screen.findByTestId('hover-card')).toBeDefined();
					}
				},
			);
		});

		describe('noFadeDelay', () => {
			it('noFadeDelay should cancel fade in/out timeouts when is true', async () => {
				const { event } = await standaloneSetUp(undefined, {
					noFadeDelay: true,
				});

				act(() => {
					jest.advanceTimersByTime(0); // No Fade In Delay
				});
				expect(await screen.findByTestId('hover-card')).toBeInTheDocument();

				const triggerArea = await screen.findByTestId('hover-card-trigger-wrapper');
				expect(triggerArea).toBeDefined();

				await act(async () => {
					await event.unhover(triggerArea);
					jest.advanceTimersByTime(0); // No Fade Out Delay
				});
				expect(screen.queryByTestId('hover-card')).not.toBeInTheDocument();
			});

			it('noFadeDelay should not cancel fade in/out timeouts when is false', async () => {
				const { event } = await standaloneSetUp(undefined, {
					noFadeDelay: false,
				});

				act(() => {
					jest.advanceTimersByTime(499);
				});
				expect(screen.queryByTestId('hover-card')).toBeNull();

				act(() => {
					jest.advanceTimersByTime(1); // Fade In Delay completed
				});

				expect(screen.queryByTestId('hover-card')).not.toBeNull();

				const triggerArea = await screen.findByTestId('hover-card-trigger-wrapper');
				expect(triggerArea).toBeDefined();

				await event.unhover(triggerArea);

				act(() => {
					jest.advanceTimersByTime(299); // Fade Out Delay not completed yet
				});
				expect(screen.queryByTestId('hover-card')).not.toBeNull();

				act(() => {
					jest.advanceTimersByTime(1); // Fade Out Delay completed
				});
				expect(screen.queryByTestId('hover-card')).toBeNull();
			});
		});

		describe('can open', () => {
			const testId = 'hover-test-can-open-div';
			const contentTestId = 'smart-block-title-resolved-view';

			it.each<['should' | 'should not', boolean]>([
				['should', true],
				['should not', false],
			])('%s show hover card when canOpen is %s', async (outcome, canOpen) => {
				await setup({
					testId,
					component: <TestCanOpenComponent canOpen={canOpen} testId={testId} />,
				});
				if (outcome === 'should') {
					const hoverContent = await screen.findByTestId(contentTestId);
					expect(hoverContent).toBeInTheDocument();
				} else {
					const hoverContent = screen.queryByTestId(contentTestId);
					expect(hoverContent).not.toBeInTheDocument();
				}
			});

			it('show and hide hover card when at canOpen change value', async () => {
				const { event } = await setup({
					testId,
					component: <TestCanOpenComponent testId={testId} />,
				});
				// Element has not set canOpen value (default)
				expect(await screen.findByTestId(contentTestId)).toBeInTheDocument();
				// Element sets to can open
				const canOpenElement = await screen.findByTestId(`${testId}-can-open`);
				await event.hover(canOpenElement);
				expect(await screen.findByTestId(contentTestId)).toBeInTheDocument();
				// Element sets to cannot open
				const cannotOpenElement = await screen.findByTestId(`${testId}-cannot-open`);
				await act(async () => {
					await event.hover(cannotOpenElement);
				});
				expect(screen.queryByTestId(contentTestId)).not.toBeInTheDocument();
				// Go back to element sets to can open again
				const canOpenElementAgain = await screen.findByTestId(`${testId}-can-open`);
				await event.hover(canOpenElementAgain);
				expect(await screen.findByTestId(contentTestId)).toBeInTheDocument();
			});
		});

		describe('custom hoverPreviewOptions render via feature flag', () => {
			const customContentTestId = 'custom-hover-card-content';

			it('renders custom content instead of default view', async () => {
				await standaloneSetUp(undefined, {
					noFadeDelay: true,
					hoverPreviewOptions: {
						render: () => <div data-testid={customContentTestId}>Custom Content</div>,
					},
				});

				expect(await screen.findByTestId(customContentTestId)).toBeInTheDocument();
				expect(screen.queryByTestId('smart-block-title-resolved-view')).toBeNull();
			});

			it('falls back to default view when render returns null', async () => {
				await standaloneSetUp(undefined, {
					noFadeDelay: true,
					hoverPreviewOptions: {
						render: () => null,
					},
				});

				expect(screen.queryByTestId(customContentTestId)).toBeNull();
				expect(await screen.findByTestId('smart-block-title-resolved-view')).toBeInTheDocument();
			});
		});

		describe('z-index', () => {
			it('renders with defaults z-index', async () => {
				await standaloneSetUp();
				const hoverCard = await screen.findByTestId('hover-card');
				const portal = hoverCard.closest('.atlaskit-portal');
				expect(portal).toHaveStyle('z-index: 510');
			});
			it('renders with provided z-index', async () => {
				await standaloneSetUp(undefined, {
					zIndex: 10,
				});
				const hoverCard = await screen.findByTestId('hover-card');
				const portal = hoverCard.closest('.atlaskit-portal');
				expect(portal).toHaveStyle('z-index: 10');
			});
		});

		describe('hide preview via actionOptions prop', () => {
			it('should not show the full screen view action if excluded via actionOptions prop', async () => {
				await standaloneSetUp(undefined, {
					actionOptions: {
						hide: false,
						exclude: [CardAction.PreviewAction],
					},
				});
				const footerBlock = await screen.findByTestId('smart-ai-footer-block-resolved-view');
				expect(footerBlock).toBeTruthy();
				const fullscreenButton = screen.queryByTestId('preview-content-button-wrapper');
				expect(fullscreenButton).toBeFalsy();
			});
		});

		describe('shouldRenderToParent and popupComponent props', () => {
			it('should render popup not in portal when shouldRenderToParent is true', async () => {
				await standaloneSetUp(undefined, {
					shouldRenderToParent: true,
					noFadeDelay: true,
				});

				const hoverCard = await screen.findByTestId('hover-card');
				expect(hoverCard).toBeInTheDocument();
				// When shouldRenderToParent is true, the popup should NOT be in a portal
				expect(hoverCard.closest('.atlaskit-portal')).not.toBeInTheDocument();
			});

			it('should render popup in portal when shouldRenderToParent is false', async () => {
				await standaloneSetUp(undefined, {
					shouldRenderToParent: false,
					noFadeDelay: true,
				});

				const hoverCard = await screen.findByTestId('hover-card');
				expect(hoverCard).toBeInTheDocument();
				// When shouldRenderToParent is false, the popup should be rendered in a portal
				expect(hoverCard.closest('.atlaskit-portal')).toBeInTheDocument();
			});
		});
	});
});

ffTest.on('townsquare-same-tab-alignment-gcko-849', 'hover card', () => {
	beforeEach(() => {
		jest.useFakeTimers({ legacyFakeTimers: true });
	});

	afterEach(() => {
		act(() => jest.runAllTimers());
		jest.useRealTimers();
		jest.restoreAllMocks();
	});

	it('should open the title link in same tab when product is Atlas', async () => {
		const testId = 'hover-trigger-test-id';
		await setup({
			testId,
			component: <TestProductComponent testId={testId} />,
			product: 'ATLAS',
		});
		// Need to advance timers to show the hover card
		act(() => {
			jest.advanceTimersByTime(500); // Default hover delay
		});
		const titleBlockLinkElement = await screen.findByTestId('smart-element-link');
		// When target is '_self', the target attribute is not set (defaults to _self)
		expect(titleBlockLinkElement).not.toHaveAttribute('target');
	});
	it('should still render title even when product is not set', async () => {
		const testId = 'hover-trigger-test-id';
		await setup({
			testId,
			component: <TestProductComponent testId={testId} />,
		});
		// Need to advance timers to show the hover card
		act(() => {
			jest.advanceTimersByTime(500); // Default hover delay
		});
		const titleBlockLinkElement = await screen.findByTestId('smart-element-link');
		expect(titleBlockLinkElement).toBeVisible();
	});
});
