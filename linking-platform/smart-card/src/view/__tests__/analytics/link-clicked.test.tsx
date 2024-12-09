import React from 'react';

import '@atlaskit/link-test-helpers/jest';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { type CardClient } from '@atlaskit/link-provider';
import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers';
import * as userAgent from '@atlaskit/linking-common/user-agent';

import { Provider, TitleBlock } from '../../../index';
import { ANALYTICS_CHANNEL } from '../../../utils/analytics';
import { fakeFactory, mocks } from '../../../utils/mocks';
import { Card, type CardProps } from '../../Card';

mockSimpleIntersectionObserver();

jest.mock('react-lazily-render', () => (data: any) => data.content);
jest.mock('react-transition-group/Transition', () => (data: any) => data.children);

jest.mock('@atlaskit/linking-common/user-agent', () => ({
	browser: jest.fn(() => ({
		mac: false,
		safari: false,
	})),
}));

type TestCaseOptions = {
	/**
	 * Callback to fire after render but before clicking
	 */
	beforeClick?: () => Promise<void>;
	/**
	 * Link selector to target an element to click
	 */
	selector?: () => Promise<HTMLElement>;
	/**
	 * Expected context to be seen on the event
	 */
	context?: Record<string, unknown>[];
	/**
	 * Feature flags to supply to the smart card provider
	 */
	featureFlags?: React.ComponentProps<typeof Provider>['featureFlags'];
};

const PACKAGE_CONTEXT = {
	componentName: 'smart-cards',
	packageName: '@product/platform',
	packageVersion: '0.0.0',
};

const HOVER_CARD_CONTEXT = {
	attributes: {
		display: 'hoverCardPreview',
	},
	source: 'smartLinkPreviewHoverCard',
};

describe('`link clicked`', () => {
	let mockClient: CardClient;
	let mockFetch: jest.Mock;
	let mockPostData: jest.Mock;
	let mockWindowOpen: jest.Mock;

	beforeEach(() => {
		mockWindowOpen = jest.fn();
		mockFetch = jest.fn(async () => ({
			...mocks.success,
			// set preview to about:blank so it doesn't try and load the iframe
			data: { ...mocks.success.data, preview: { href: 'about:blank' } },
		}));
		mockPostData = jest.fn(async () => mocks.actionSuccess);
		mockClient = new (fakeFactory(mockFetch, mockPostData))();
		global.open = mockWindowOpen;
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	/**
	 * Each case here defines a link instance to test
	 * These cases have different behaviour to hover card + flex UI
	 * Browser behaviour is sometimes hijacked
	 */
	describe.each<[string, Pick<CardProps, 'appearance'> & Partial<CardProps>, TestCaseOptions?]>([
		[
			'inline',
			{ appearance: 'inline' },
			{ selector: () => screen.findByTestId('card-resolved-view') },
		],
		[
			'block card',
			{ appearance: 'block' },
			{
				beforeClick: async () => {
					await screen.findByTestId('smart-block-title-resolved-view');
				},
				context: [PACKAGE_CONTEXT],
			},
		],
		[
			'embed',
			{ appearance: 'embed' },
			{
				beforeClick: async () => {
					// wait for resolved view to render
					await screen.findByTestId('card');
				},
			},
		],
	])('with `%s` appearance', (name, cardProps, options) => {
		const setup = async (props: Partial<React.ComponentProps<typeof Card>> = {}) => {
			const user = userEvent.setup();
			const spy = jest.fn();
			const { selector, beforeClick, featureFlags } = options ?? {};

			render(
				<AnalyticsListener onEvent={spy} channel={ANALYTICS_CHANNEL}>
					<IntlProvider locale="en">
						<Provider client={mockClient} featureFlags={featureFlags}>
							<Card testId="card" url="https://atlassian.com" {...cardProps} {...props} />
						</Provider>
					</IntlProvider>
				</AnalyticsListener>,
			);

			await beforeClick?.();

			const link = selector ? await selector() : await screen.findByRole('link');

			return {
				spy,
				user,
				link,
			};
		};

		describe('left click', () => {
			it('should fire with `clickOutcome` = `clickThrough` by default', async () => {
				const { spy, user, link } = await setup();

				await user.click(link);

				expect(spy).toBeFiredWithAnalyticEventOnce(
					{
						payload: {
							action: 'clicked',
							actionSubject: 'link',
							eventType: 'ui',
							attributes: {
								clickType: 'left',
								clickOutcome: 'clickThrough',
								keysHeld: [],
							},
						},
					},
					ANALYTICS_CHANNEL,
				);
			});

			it('should fire with `clickOutcome` = `clickThrough` if the event default behaviour is prevented', async () => {
				const { spy, user, link } = await setup({
					onClick: (e) => {
						e.preventDefault();
					},
				});

				await user.click(link);

				/**
				 * Old block cards render links with target blank, causing the link to open in new tab
				 * This is not the case for inline + embed appearances + block(flexible) when the FF is enabled
				 */
				const getTestCaseClickOutcome = () => {
					if (name === 'legacy block card') {
						return 'clickThroughNewTabOrWindow';
					}
					return 'clickThrough';
				};

				expect(spy).toBeFiredWithAnalyticEventOnce(
					{
						payload: {
							action: 'clicked',
							actionSubject: 'link',
							eventType: 'ui',
							attributes: {
								clickType: 'left',
								clickOutcome: getTestCaseClickOutcome(),
								defaultPrevented: true,
								keysHeld: [],
							},
						},
					},
					ANALYTICS_CHANNEL,
				);
			});

			/**
			 * This is not the default behaviour but hijacked behaviour
			 */
			it('should fire with `clickOutcome` = `clickThrough` if the alt key is held', async () => {
				const { spy, user, link } = await setup();

				await user.keyboard('{Alt>}');
				await user.click(link);

				expect(spy).toBeFiredWithAnalyticEventOnce(
					{
						payload: {
							action: 'clicked',
							actionSubject: 'link',
							eventType: 'ui',
							attributes: {
								clickType: 'left',
								clickOutcome: 'clickThrough',
								keysHeld: ['alt'],
							},
						},
					},
					ANALYTICS_CHANNEL,
				);
			});

			it('should fire with `clickOutcome` = `alt` if the alt key is held and an `onClick` is supplied', async () => {
				const { spy, user, link } = await setup({ onClick: jest.fn() });

				await user.keyboard('{Alt>}');
				await user.click(link);

				expect(spy).toBeFiredWithAnalyticEventOnce(
					{
						payload: {
							action: 'clicked',
							actionSubject: 'link',
							eventType: 'ui',
							attributes: {
								clickType: 'left',
								clickOutcome: 'alt',
								defaultPrevented: true,
								keysHeld: ['alt'],
							},
						},
					},
					ANALYTICS_CHANNEL,
				);
			});

			/**
			 * This is not the default behaviour but hijacked behaviour
			 */
			it('should fire with `clickOutcome` = `clickThrough` if the shift key is held', async () => {
				const { spy, user, link } = await setup();

				await user.keyboard('{Shift>}');
				await user.click(link);

				expect(spy).toBeFiredWithAnalyticEventOnce(
					{
						payload: {
							action: 'clicked',
							actionSubject: 'link',
							eventType: 'ui',
							attributes: {
								clickType: 'left',
								clickOutcome: 'clickThrough',
								defaultPrevented: true,
								keysHeld: ['shift'],
							},
						},
					},
					ANALYTICS_CHANNEL,
				);
			});

			it('should fire with `clickOutcome` = `clickThroughNewTabOrWindow` if the shift key is held and `onClick` is provided', async () => {
				const { spy, user, link } = await setup({
					onClick: jest.fn(),
				});

				await user.keyboard('{Shift>}');
				await user.click(link);

				expect(spy).toBeFiredWithAnalyticEventOnce(
					{
						payload: {
							action: 'clicked',
							actionSubject: 'link',
							eventType: 'ui',
							attributes: {
								clickType: 'left',
								clickOutcome: 'clickThroughNewTabOrWindow',
								defaultPrevented: true,
								keysHeld: ['shift'],
							},
						},
					},
					ANALYTICS_CHANNEL,
				);
			});

			it('should fire with `clickOutcome` = `clickThrough` if the meta key is held (NOT macOS) and an `onClick` is supplied', async () => {
				jest.spyOn(userAgent, 'browser').mockReturnValue({ mac: false } as any);
				const { spy, user, link } = await setup({ onClick: jest.fn() });

				await user.keyboard('{Meta>}');
				await user.click(link);

				expect(spy).toBeFiredWithAnalyticEventOnce(
					{
						payload: {
							action: 'clicked',
							actionSubject: 'link',
							eventType: 'ui',
							attributes: {
								clickType: 'left',
								clickOutcome: 'clickThrough',
								defaultPrevented: true,
								keysHeld: ['meta'],
							},
						},
					},
					ANALYTICS_CHANNEL,
				);
			});

			it('should fire with `clickOutcome` = `clickThroughNewTabOrWindow` if the meta key (IS macOS) is held and an `onClick` is supplied', async () => {
				jest.spyOn(userAgent, 'browser').mockReturnValue({ mac: true } as any);
				const { spy, user, link } = await setup({ onClick: jest.fn() });

				await user.keyboard('{Meta>}');
				await user.click(link);

				expect(spy).toBeFiredWithAnalyticEventOnce(
					{
						payload: {
							action: 'clicked',
							actionSubject: 'link',
							eventType: 'ui',
							attributes: {
								clickType: 'left',
								clickOutcome: 'clickThroughNewTabOrWindow',
								defaultPrevented: true,
								keysHeld: ['meta'],
							},
						},
					},
					ANALYTICS_CHANNEL,
				);
			});

			it('should fire with `clickOutcome` = `clickThrough` if the ctrl key is held (NOT macOS) but an `onClick` is supplied', async () => {
				jest.spyOn(userAgent, 'browser').mockReturnValue({ mac: false } as any);

				const { spy, user, link } = await setup({ onClick: jest.fn() });

				await user.keyboard('{Control>}');
				await user.click(link);

				expect(spy).toBeFiredWithAnalyticEventOnce(
					{
						payload: {
							action: 'clicked',
							actionSubject: 'link',
							eventType: 'ui',
							attributes: {
								clickType: 'left',
								clickOutcome: 'clickThroughNewTabOrWindow',
								defaultPrevented: true,
								keysHeld: ['ctrl'],
							},
						},
					},
					ANALYTICS_CHANNEL,
				);
			});

			it('should fire with `clickOutcome` = `clickThroughNewTabOrWindow` if the ctrl key is held (NOT macOS) and `onClick` is NOT supplied', async () => {
				jest.spyOn(userAgent, 'browser').mockReturnValue({ mac: false } as any);

				const { spy, user, link } = await setup();

				await user.keyboard('{Control>}');
				await user.click(link);

				expect(spy).toBeFiredWithAnalyticEventOnce(
					{
						payload: {
							action: 'clicked',
							actionSubject: 'link',
							eventType: 'ui',
							attributes: {
								clickType: 'left',
								clickOutcome: 'clickThroughNewTabOrWindow',
								defaultPrevented: true,
								keysHeld: ['ctrl'],
							},
						},
					},
					ANALYTICS_CHANNEL,
				);
			});

			it('should fire with `clickOutcome` = `clickThroughNewTab` if the ctrl key is held on macOS (if onClick is triggered and `onClick` is NOT provided)', async () => {
				jest.spyOn(userAgent, 'browser').mockReturnValue({ mac: true } as any);

				const { spy, user, link } = await setup();

				await user.keyboard('{Control>}');
				await user.click(link);

				expect(spy).toBeFiredWithAnalyticEventOnce(
					{
						payload: {
							action: 'clicked',
							actionSubject: 'link',
							eventType: 'ui',
							attributes: {
								clickType: 'left',
								clickOutcome: 'clickThroughNewTabOrWindow',
								defaultPrevented: true,
								keysHeld: ['ctrl'],
							},
						},
					},
					ANALYTICS_CHANNEL,
				);
			});

			/**
			 * This doesn't typically occur in practice, ctrl+left click on mac defaults to a right click outcome (context menu)
			 * but it won't actually cause `onClick` to be triggered, `onMouseDown` will be triggered but the button will be 0 (left click)
			 * and we are ignoring left clicks for `onMouseDown`
			 *
			 * Outcome here is prevented because of the hi-jack logic which prevents click through if there is an `onClick` provided
			 */
			it('should fire with `clickOutcome` = `clickThrough` if the ctrl key is held on macOS (if onClick is triggered and `onClick` is provided)', async () => {
				jest.spyOn(userAgent, 'browser').mockReturnValue({ mac: true } as any);

				const { spy, user, link } = await setup({ onClick: jest.fn() });

				await user.keyboard('{Control>}');
				await user.click(link);

				expect(spy).toBeFiredWithAnalyticEventOnce(
					{
						payload: {
							action: 'clicked',
							actionSubject: 'link',
							eventType: 'ui',
							attributes: {
								clickType: 'left',
								clickOutcome: 'clickThrough',
								defaultPrevented: true,
								keysHeld: ['ctrl'],
							},
						},
					},
					ANALYTICS_CHANNEL,
				);
			});
		});

		describe('middle click', () => {
			it('should fire with `clickOutcome` = `clickThroughNewTab` when middle clicking', async () => {
				const { spy, user, link } = await setup();

				await user.pointer({ target: link, keys: '[MouseMiddle]' });

				expect(spy).toBeFiredWithAnalyticEventOnce(
					{
						payload: {
							action: 'clicked',
							actionSubject: 'link',
							eventType: 'ui',
							attributes: {
								clickType: 'middle',
								clickOutcome: 'clickThroughNewTabOrWindow',
								defaultPrevented: false,
								keysHeld: [],
							},
						},
					},
					ANALYTICS_CHANNEL,
				);
			});
		});

		describe('right click', () => {
			it('should fire with `clickOutcome` = `contextMenu` when right clicking', async () => {
				const { spy, user, link } = await setup();

				await user.pointer({ target: link, keys: '[MouseRight]' });

				expect(spy).toBeFiredWithAnalyticEventOnce(
					{
						payload: {
							action: 'clicked',
							actionSubject: 'link',
							eventType: 'ui',
							attributes: {
								clickType: 'right',
								clickOutcome: 'contextMenu',
								defaultPrevented: false,
								keysHeld: [],
							},
						},
					},
					ANALYTICS_CHANNEL,
				);
			});
		});

		/**
		 * With the link in focus, pressing enter key should in theory fire similar events to left click,
		 * however some behaviour in tests doesn't seem to reflect what actually happens, so only verifying what we can here,
		 * and that clickType = keyboard.
		 * Notably holding alt or control key don't fire link clicked in tests
		 */
		describe('keyboard', () => {
			it('should fire with `clickOutcome` = `clickThrough` when triggered with keyboard', async () => {
				const { spy, user, link } = await setup();

				link.focus();
				await user.keyboard('{Enter}');

				expect(spy).toBeFiredWithAnalyticEventOnce(
					{
						payload: {
							action: 'clicked',
							actionSubject: 'link',
							eventType: 'ui',
							attributes: {
								clickType: 'keyboard',
								clickOutcome: 'clickThrough',
								keysHeld: [],
							},
						},
					},
					ANALYTICS_CHANNEL,
				);
			});

			/**
			 * This is not the default behaviour but hijacked behaviour
			 */
			it('should fire with `clickOutcome` = `clickThrough` if the shift key is held when triggered with keyboard', async () => {
				const { spy, user, link } = await setup();

				link.focus();
				await user.keyboard('{Shift>}{Enter}');

				expect(spy).toBeFiredWithAnalyticEventOnce(
					{
						payload: {
							action: 'clicked',
							actionSubject: 'link',
							eventType: 'ui',
							attributes: {
								clickType: 'keyboard',
								clickOutcome: 'clickThrough',
								defaultPrevented: true,
								keysHeld: ['shift'],
							},
						},
					},
					ANALYTICS_CHANNEL,
				);
			});

			it('should fire with `clickOutcome` = `clickThroughNewTabOrWindow` if the meta key is held when triggered with keyboard', async () => {
				const { spy, user, link } = await setup();

				link.focus();
				await user.keyboard('{Meta>}{Enter}');

				expect(spy).toBeFiredWithAnalyticEventOnce(
					{
						payload: {
							action: 'clicked',
							actionSubject: 'link',
							eventType: 'ui',
							attributes: {
								clickType: 'keyboard',
								clickOutcome: 'clickThroughNewTabOrWindow',
								defaultPrevented: true,
								keysHeld: ['meta'],
							},
						},
					},
					ANALYTICS_CHANNEL,
				);
			});
		});
	});

	/**
	 * These cases exhibit normal click through behaviour
	 * There is no exception logic that hi-jack clicks
	 */
	describe.each<['hoverCard' | 'flexible', TestCaseOptions?]>([
		[
			'hoverCard',
			{
				selector: () => screen.findByTestId('smart-element-link'),
				beforeClick: async () => {
					const card = await screen.findByTestId('card-resolved-view');
					await userEvent.hover(card);
				},
				context: [PACKAGE_CONTEXT, HOVER_CARD_CONTEXT],
			},
		],
		[
			'flexible',
			{
				selector: async () => {
					await screen.findByTestId('smart-block-title-resolved-view');
					return screen.findByTestId('smart-element-link');
				},
				context: [PACKAGE_CONTEXT],
			},
		],
	])('with `%s` appearance with options %j', (testCase, options) => {
		const setup = async (props: Partial<React.ComponentProps<typeof Card>> = {}) => {
			const user = userEvent.setup();
			const spy = jest.fn();
			const { selector, beforeClick, featureFlags } = options ?? {};

			const getCardProps = () => {
				switch (testCase) {
					case 'hoverCard':
						return {
							appearance: 'inline',
							showHoverPreview: true,
						} as const;
					case 'flexible':
						return {
							appearance: 'inline',
							children: [<TitleBlock />],
						} as const;
					default:
						throw new Error('Unhandled test case');
				}
			};

			render(
				<AnalyticsListener onEvent={spy} channel={ANALYTICS_CHANNEL}>
					<IntlProvider locale="en">
						<Provider client={mockClient} featureFlags={featureFlags}>
							<Card testId="card" url="about:blank" {...props} {...getCardProps()} />
						</Provider>
					</IntlProvider>
				</AnalyticsListener>,
			);

			await beforeClick?.();

			const link = selector ? await selector() : await screen.findByRole('link');

			return {
				spy,
				user,
				link,
			};
		};

		describe('left click', () => {
			it('should fire with `clickOutcome` = `clickThroughNewTabOrWindow` by default (we render target="_blank")', async () => {
				const { spy, user, link } = await setup();

				await user.click(link);

				expect(spy).toBeFiredWithAnalyticEventOnce(
					{
						context: options?.context,
						payload: {
							action: 'clicked',
							actionSubject: 'link',
							eventType: 'ui',
							attributes: {
								clickType: 'left',
								clickOutcome: 'clickThroughNewTabOrWindow',
								keysHeld: [],
							},
						},
					},
					ANALYTICS_CHANNEL,
				);
			});

			it('should fire with `defaultPrevented` = `true` if the event default behaviour is prevented', async () => {
				const { spy, user, link } = await setup({
					onClick: (e) => {
						e.preventDefault();
					},
				});

				await user.click(link);

				/**
				 * In the case of flex UI the onClick handler is passed to the title
				 * preventing clickthrough
				 *
				 * In the case of hoverCard the onClick handler is not provided to the title block and there is no
				 * preventing of default behaviour
				 */
				const getTestCaseDefaultPrevented = () => {
					switch (testCase) {
						case 'hoverCard':
							return false;
						case 'flexible':
							return true;
					}
				};

				expect(spy).toBeFiredWithAnalyticEventOnce(
					{
						context: options?.context,
						payload: {
							action: 'clicked',
							actionSubject: 'link',
							eventType: 'ui',
							attributes: {
								clickType: 'left',
								clickOutcome: 'clickThroughNewTabOrWindow',
								keysHeld: [],
								defaultPrevented: getTestCaseDefaultPrevented(),
							},
						},
					},
					ANALYTICS_CHANNEL,
				);
			});

			it('should fire with `clickOutcome` = `alt` if the alt key is held', async () => {
				const { spy, user, link } = await setup();

				await user.keyboard('{Alt>}');
				await user.click(link);

				expect(spy).toBeFiredWithAnalyticEventOnce(
					{
						context: options?.context,
						payload: {
							action: 'clicked',
							actionSubject: 'link',
							eventType: 'ui',
							attributes: {
								clickType: 'left',
								clickOutcome: 'alt',
								keysHeld: ['alt'],
							},
						},
					},
					ANALYTICS_CHANNEL,
				);
			});

			it('should fire with `clickOutcome` = `alt` if the alt key is held but an `onClick` is supplied', async () => {
				const { spy, user, link } = await setup({ onClick: jest.fn() });

				await user.keyboard('{Alt>}');
				await user.click(link);

				expect(spy).toBeFiredWithAnalyticEventOnce(
					{
						context: options?.context,
						payload: {
							action: 'clicked',
							actionSubject: 'link',
							eventType: 'ui',
							attributes: {
								clickType: 'left',
								clickOutcome: 'alt',
								keysHeld: ['alt'],
							},
						},
					},
					ANALYTICS_CHANNEL,
				);
			});

			it('should fire with `clickOutcome` = `clickThroughNewTabOrWindow` if the shift key is held', async () => {
				const { spy, user, link } = await setup();

				await user.keyboard('{Shift>}');
				await user.click(link);

				expect(spy).toBeFiredWithAnalyticEventOnce(
					{
						context: options?.context,
						payload: {
							action: 'clicked',
							actionSubject: 'link',
							eventType: 'ui',
							attributes: {
								clickType: 'left',
								clickOutcome: 'clickThroughNewTabOrWindow',
								keysHeld: ['shift'],
							},
						},
					},
					ANALYTICS_CHANNEL,
				);
			});

			it('should fire with `clickOutcome` = `clickThroughNewTabOrWindow` if the shift key is held and `onClick` is provided', async () => {
				const { spy, user, link } = await setup({
					onClick: jest.fn(),
				});

				await user.keyboard('{Shift>}');
				await user.click(link);

				expect(spy).toBeFiredWithAnalyticEventOnce(
					{
						context: options?.context,
						payload: {
							action: 'clicked',
							actionSubject: 'link',
							eventType: 'ui',
							attributes: {
								clickType: 'left',
								clickOutcome: 'clickThroughNewTabOrWindow',
								keysHeld: ['shift'],
							},
						},
					},
					ANALYTICS_CHANNEL,
				);
			});

			it('should fire with `clickOutcome` = `clickThroughNewTabOrWindow` if the shift key is held but an `onClick` is supplied (windows)', async () => {
				jest.spyOn(userAgent, 'browser').mockReturnValue({ mac: false } as any);

				const { spy, user, link } = await setup({ onClick: jest.fn() });

				await user.keyboard('{Shift>}');
				await user.click(link);

				expect(spy).toBeFiredWithAnalyticEventOnce(
					{
						context: options?.context,
						payload: {
							action: 'clicked',
							actionSubject: 'link',
							eventType: 'ui',
							attributes: {
								clickType: 'left',
								clickOutcome: 'clickThroughNewTabOrWindow',
								keysHeld: ['shift'],
							},
						},
					},
					ANALYTICS_CHANNEL,
				);
			});

			it('should fire with `clickOutcome` = `clickThrough` if the meta key is held but an `onClick` is supplied (windows)', async () => {
				jest.spyOn(userAgent, 'browser').mockReturnValue({ mac: false } as any);

				const { spy, user, link } = await setup({ onClick: jest.fn() });

				await user.keyboard('{Meta>}');
				await user.click(link);

				expect(spy).toBeFiredWithAnalyticEventOnce(
					{
						context: options?.context,
						payload: {
							action: 'clicked',
							actionSubject: 'link',
							eventType: 'ui',
							attributes: {
								clickType: 'left',
								clickOutcome: 'clickThrough',
								keysHeld: ['meta'],
							},
						},
					},
					ANALYTICS_CHANNEL,
				);
			});

			it('should fire with `clickOutcome` = `clickThroughNewTabOrWindow` if the ctrl key is held but an `onClick` is supplied (windows)', async () => {
				jest.spyOn(userAgent, 'browser').mockReturnValue({ mac: false } as any);

				const { spy, user, link } = await setup({ onClick: jest.fn() });

				await user.keyboard('{Control>}');
				await user.click(link);

				expect(spy).toBeFiredWithAnalyticEventOnce(
					{
						context: options?.context,
						payload: {
							action: 'clicked',
							actionSubject: 'link',
							eventType: 'ui',
							attributes: {
								clickType: 'left',
								clickOutcome: 'clickThroughNewTabOrWindow',
								keysHeld: ['ctrl'],
							},
						},
					},
					ANALYTICS_CHANNEL,
				);
			});

			it('should fire with `clickOutcome` = `clickThrough` if the ctrl key is held (NOT macOS) and no `onClick` is provided', async () => {
				jest.spyOn(userAgent, 'browser').mockReturnValue({ mac: false } as any);

				const { spy, user, link } = await setup();

				await user.keyboard('{Control>}');
				await user.click(link);

				expect(spy).toBeFiredWithAnalyticEventOnce(
					{
						context: options?.context,
						payload: {
							action: 'clicked',
							actionSubject: 'link',
							eventType: 'ui',
							attributes: {
								clickType: 'left',
								clickOutcome: 'clickThroughNewTabOrWindow',
								keysHeld: ['ctrl'],
							},
						},
					},
					ANALYTICS_CHANNEL,
				);
			});

			/**
			 * This test case is not realistic
			 * A ctrl+left click on mac doesn't typically produce a left click, it actually produces a right click
			 * So this test case doesn't occur in the wild as far as I know
			 */
			it('should fire with `clickOutcome` = `clickThrough` if the ctrl key is held on macOS (if onClick is triggered and `onClick` is NOT provided)', async () => {
				jest.spyOn(userAgent, 'browser').mockReturnValue({ mac: true } as any);

				const { spy, user, link } = await setup();

				await user.keyboard('{Control>}');
				await user.click(link);

				expect(spy).toBeFiredWithAnalyticEventOnce(
					{
						context: options?.context,
						payload: {
							action: 'clicked',
							actionSubject: 'link',
							eventType: 'ui',
							attributes: {
								clickType: 'left',
								clickOutcome: 'clickThrough',
								keysHeld: ['ctrl'],
							},
						},
					},
					ANALYTICS_CHANNEL,
				);
			});

			it('should fire with `clickOutcome` = `clickThroughNewTab` if the ctrl key is held on macOS (if onClick is triggered and `onClick` is provided)', async () => {
				jest.spyOn(userAgent, 'browser').mockReturnValue({ mac: true } as any);

				const { spy, user, link } = await setup({ onClick: jest.fn() });

				await user.keyboard('{Control>}');
				await user.click(link);

				expect(spy).toBeFiredWithAnalyticEventOnce(
					{
						context: options?.context,
						payload: {
							action: 'clicked',
							actionSubject: 'link',
							eventType: 'ui',
							attributes: {
								clickType: 'left',
								clickOutcome: 'clickThrough',
								keysHeld: ['ctrl'],
							},
						},
					},
					ANALYTICS_CHANNEL,
				);
			});
		});

		describe('middle click', () => {
			it('should fire with `clickOutcome` = `clickThroughNewTabOrWindow` when middle clicking', async () => {
				const { spy, user, link } = await setup();

				await user.pointer({ target: link, keys: '[MouseMiddle]' });

				expect(spy).toBeFiredWithAnalyticEventOnce(
					{
						context: options?.context,
						payload: {
							action: 'clicked',
							actionSubject: 'link',
							eventType: 'ui',
							attributes: {
								clickType: 'middle',
								clickOutcome: 'clickThroughNewTabOrWindow',
								keysHeld: [],
							},
						},
					},
					ANALYTICS_CHANNEL,
				);
			});
		});

		describe('right click', () => {
			it('should fire with `clickOutcome` = `contextMenu` when right clicking', async () => {
				const { spy, user, link } = await setup();

				await user.pointer({ target: link, keys: '[MouseRight]' });

				expect(spy).toBeFiredWithAnalyticEventOnce(
					{
						context: options?.context,
						payload: {
							action: 'clicked',
							actionSubject: 'link',
							eventType: 'ui',
							attributes: {
								clickType: 'right',
								clickOutcome: 'contextMenu',
								keysHeld: [],
							},
						},
					},
					ANALYTICS_CHANNEL,
				);
			});
		});

		/**
		 * With the link in focus, pressing enter key should in theory fire similar events to left click,
		 * however some behaviour in tests doesn't seem to reflect what actually happens, so only verifying what we can here,
		 * and that clickType = keyboard.
		 * Notably holding alt or control key don't fire link clicked in tests
		 */
		describe('keyboard', () => {
			it('should fire with `clickOutcome` = `clickThroughNewTabOrWindow` by default (we render target="_blank")', async () => {
				const { spy, user, link } = await setup();

				link.focus();
				await user.keyboard('{Enter}');

				expect(spy).toBeFiredWithAnalyticEventOnce(
					{
						context: options?.context,
						payload: {
							action: 'clicked',
							actionSubject: 'link',
							eventType: 'ui',
							attributes: {
								clickType: 'keyboard',
								clickOutcome: 'clickThroughNewTabOrWindow',
								keysHeld: [],
							},
						},
					},
					ANALYTICS_CHANNEL,
				);
			});

			it('should fire with `clickOutcome` = `clickThrough` if the shift key is held', async () => {
				const { spy, user, link } = await setup();

				link.focus();
				await user.keyboard('{Shift>}{Enter}');

				expect(spy).toBeFiredWithAnalyticEventOnce(
					{
						context: options?.context,
						payload: {
							action: 'clicked',
							actionSubject: 'link',
							eventType: 'ui',
							attributes: {
								clickType: 'keyboard',
								clickOutcome: 'clickThroughNewTabOrWindow',
								keysHeld: ['shift'],
							},
						},
					},
					ANALYTICS_CHANNEL,
				);
			});

			it('should fire with `clickOutcome` = `clickThroughNewTabOrWindow` if the meta key is held', async () => {
				const { spy, user, link } = await setup();

				link.focus();
				await user.keyboard('{Meta>}{Enter}');

				expect(spy).toBeFiredWithAnalyticEventOnce(
					{
						context: options?.context,
						payload: {
							action: 'clicked',
							actionSubject: 'link',
							eventType: 'ui',
							attributes: {
								clickType: 'keyboard',
								clickOutcome: 'clickThroughNewTabOrWindow',
								keysHeld: ['meta'],
							},
						},
					},
					ANALYTICS_CHANNEL,
				);
			});
		});
	});
});
