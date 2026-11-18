import '@atlaskit/link-test-helpers/jest';
import React from 'react';

import { act } from '@testing-library/react';

import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { renderWithIntl } from '@atlaskit/link-test-helpers/react-testing-library';
import { ResolvedClient } from '@atlaskit/link-test-helpers/smart-card/mocks/clients';
import { type CardStore } from '@atlaskit/linking-common/store';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { startUfoExperience } from '../../../../state/analytics/startUfoExperience';
import * as seenEventModule from '../../../../state/hooks/use-smart-link-seen-event';
import { ANALYTICS_CHANNEL } from '../../../../utils/analytics/analytics';
import { shouldSample } from '../../../../utils/shouldSample';
import * as componentModule from '../../component';
import { LazyIntersectionObserverCard } from '../LazyIntersectionObserverCard';

type CardAppearance = React.ComponentProps<typeof LazyIntersectionObserverCard>['appearance'];

const mockPrefetch = jest.fn();
const mockUsePrefetch = jest.fn((_url: string, _appearance: CardAppearance) => mockPrefetch);
jest.mock('../../../../state/hooks/usePrefetch', () => ({
	usePrefetch: (url: string, appearance: CardAppearance) => mockUsePrefetch(url, appearance),
}));

jest.mock('../../../../state/analytics/startUfoExperience', () => ({
	startUfoExperience: jest.fn(),
}));

jest.mock('../../../../utils/shouldSample', () => ({
	shouldSample: jest.fn(),
}));

describe('LazyIntersectionObserverCard', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const setup = (
		props: Partial<React.ComponentProps<typeof LazyIntersectionObserverCard>> = {},
		initialState?: CardStore,
	) => {
		const onEvent = jest.fn();

		const renderResult = renderWithIntl(
			<SmartCardProvider
				client={new ResolvedClient()}
				storeOptions={initialState ? { initialState } : undefined}
			>
				<AnalyticsListener onEvent={onEvent} channel={ANALYTICS_CHANNEL}>
					<LazyIntersectionObserverCard
						appearance="block"
						url="http://example.com"
						id="123"
						{...props}
					/>
				</AnalyticsListener>
			</SmartCardProvider>,
		);

		return { ...renderResult, onEvent };
	};

	const storeWith = (status: CardStore[string]['status']): CardStore => ({
		'http://example.com': { status, details: undefined },
	});

	const enableSettledRender = () => {
		passGate('platform_smartlink_render_settled_link_on_mount');
		(shouldSample as jest.Mock).mockReturnValue(true);
	};

	describe('when not intersecting', () => {
		const observe = jest.fn();
		const unobserve = jest.fn();
		const disconnect = jest.fn();

		beforeAll(() => {
			Object.defineProperty(window, 'IntersectionObserver', {
				writable: true,
				configurable: true,
				value: jest.fn(() => ({
					observe,
					unobserve,
					disconnect,
				})),
			});
		});

		it.each(['inline', 'block', 'embed'] as const)(
			'should disconnect the observer when unmounting an unseen %s placeholder',
			(appearance) => {
				const { unmount } = setup({ appearance });

				expect(observe).toHaveBeenCalledTimes(1);
				expect(disconnect).not.toHaveBeenCalled();

				unmount();

				expect(disconnect).toHaveBeenCalledTimes(1);
			},
		);

		it('should prefetch data for the card appearance', () => {
			setup({ appearance: 'inline' });

			expect(mockUsePrefetch).toHaveBeenCalledWith('http://example.com', 'inline');
		});

		describe('lazy render paths', () => {
			beforeEach(() => {
				jest
					.spyOn(componentModule, 'CardWithUrlContent')
					.mockImplementation(({ appearance }) =>
						appearance === 'inline' ? (
							<span data-testid="card-content" />
						) : (
							<div data-testid="card-content" />
						),
					);
			});

			afterEach(() => {
				jest.restoreAllMocks();
			});

			it.each(['resolved', 'unauthorized', 'forbidden', 'not_found'] as const)(
				'should render a %s link at once and still observe it',
				(status) => {
					passGate('platform_smartlink_render_settled_link_on_mount');
					const { queryByTestId } = setup({}, storeWith(status));

					expect(queryByTestId('card-content')).toBeInTheDocument();
					expect(queryByTestId('lazy-render-placeholder')).not.toBeInTheDocument();
					expect(observe).toHaveBeenCalledWith(expect.any(HTMLDivElement));
				},
			);

			it.each(['inline', 'block', 'embed'] as const)(
				'should observe the loader wrapper and render settled %s content directly inside it',
				(appearance) => {
					passGate('platform_smartlink_render_settled_link_on_mount');
					const { getByTestId } = setup(
						{ appearance, inheritDimensions: appearance === 'embed' },
						storeWith('resolved'),
					);
					const wrapper = getByTestId('card-content').parentElement;

					expect(wrapper).toHaveClass('loader-wrapper');
					expect(wrapper?.tagName).toBe(appearance === 'inline' ? 'SPAN' : 'DIV');
					expect(observe).toHaveBeenCalledTimes(1);
					expect(observe).toHaveBeenCalledWith(wrapper);
				},
			);

			it.each(['inline', 'block', 'embed'] as const)(
				'should keep observing settled %s content until intersection without remounting it',
				(appearance) => {
					enableSettledRender();
					const onSeenIntersecting = jest.fn();
					jest.spyOn(seenEventModule, 'useSmartLinkSeenEvent').mockReturnValue({
						onIntersecting: onSeenIntersecting,
						onStatusSettled: jest.fn(),
					});
					const { getByTestId, unmount } = setup(
						{ appearance, inheritDimensions: appearance === 'embed' },
						storeWith('resolved'),
					);
					const content = getByTestId('card-content');
					const wrapper = content.parentElement;
					const callback = (window.IntersectionObserver as jest.Mock).mock
						.calls[0][0] as IntersectionObserverCallback;
					const observer = (window.IntersectionObserver as jest.Mock).mock.results[0]
						.value as IntersectionObserver;

					expect(onSeenIntersecting).not.toHaveBeenCalled();
					act(() => {
						callback([{ isIntersecting: false } as IntersectionObserverEntry], observer);
					});
					expect(onSeenIntersecting).not.toHaveBeenCalled();

					act(() => {
						callback([{ isIntersecting: true } as IntersectionObserverEntry], observer);
					});

					expect(onSeenIntersecting).toHaveBeenCalledTimes(1);
					expect(getByTestId('card-content')).toBe(content);
					expect(content.parentElement).toBe(wrapper);
					expect(observe).toHaveBeenCalledTimes(1);
					expect(observe).toHaveBeenCalledWith(wrapper);
					expect(startUfoExperience).toHaveBeenCalledTimes(1);
					expect(disconnect).toHaveBeenCalledTimes(1);

					unmount();
					expect(disconnect).toHaveBeenCalledTimes(2);
				},
			);

			describe.each(['inline', 'block', 'embed'] as const)('%s placeholders', (appearance) => {
				it.each([
					{ name: 'an uncached link with the gate on', status: undefined, gateEnabled: true },
					{ name: 'a resolving link with the gate on', status: 'resolving', gateEnabled: true },
					{ name: 'an uncached link with the gate off', status: undefined, gateEnabled: false },
					{ name: 'a resolving link with the gate off', status: 'resolving', gateEnabled: false },
					{ name: 'a cached link with the gate off', status: 'resolved', gateEnabled: false },
				] as const)(
					'should preserve lazy rendering and tracking for $name',
					({ status, gateEnabled }) => {
						if (gateEnabled) {
							passGate('platform_smartlink_render_settled_link_on_mount');
						} else {
							failGate('platform_smartlink_render_settled_link_on_mount');
						}
						(shouldSample as jest.Mock).mockReturnValue(true);
						const onSeenIntersecting = jest.fn();
						jest.spyOn(seenEventModule, 'useSmartLinkSeenEvent').mockReturnValue({
							onIntersecting: onSeenIntersecting,
							onStatusSettled: jest.fn(),
						});
						const { getByTestId, queryByTestId, unmount } = setup(
							{ appearance, inheritDimensions: appearance === 'embed' },
							status ? storeWith(status) : undefined,
						);
						const placeholderWrapper = getByTestId('lazy-render-placeholder').parentElement;
						const wrapper = placeholderWrapper?.parentElement;
						const callback = (window.IntersectionObserver as jest.Mock).mock
							.calls[0][0] as IntersectionObserverCallback;
						const observer = (window.IntersectionObserver as jest.Mock).mock.results[0]
							.value as IntersectionObserver;

						expect(wrapper).toHaveClass('loader-wrapper');
						expect(placeholderWrapper?.tagName).toBe(appearance === 'inline' ? 'SPAN' : 'DIV');
						expect(observe).toHaveBeenCalledTimes(1);
						expect(observe).toHaveBeenCalledWith(gateEnabled ? wrapper : placeholderWrapper);
						expect(queryByTestId('card-content')).not.toBeInTheDocument();
						expect(startUfoExperience).not.toHaveBeenCalled();
						act(() => {
							callback([{ isIntersecting: false } as IntersectionObserverEntry], observer);
						});
						expect(mockPrefetch).toHaveBeenCalledTimes(1);
						expect(onSeenIntersecting).not.toHaveBeenCalled();
						expect(queryByTestId('card-content')).not.toBeInTheDocument();

						act(() => {
							callback([{ isIntersecting: true } as IntersectionObserverEntry], observer);
						});

						expect(queryByTestId('lazy-render-placeholder')).not.toBeInTheDocument();
						expect(getByTestId('card-content').parentElement).toBe(wrapper);
						expect(observe).toHaveBeenCalledTimes(1);
						expect(onSeenIntersecting).toHaveBeenCalledTimes(1);
						expect(startUfoExperience).toHaveBeenCalledTimes(1);
						expect((startUfoExperience as jest.Mock).mock.invocationCallOrder[0]).toBeLessThan(
							(componentModule.CardWithUrlContent as unknown as jest.Mock).mock
								.invocationCallOrder[0],
						);
						expect(disconnect).toHaveBeenCalledTimes(1);

						unmount();
						expect(disconnect).toHaveBeenCalledTimes(2);
					},
				);
			});

			it('should start the rendered experience before the card renders', () => {
				enableSettledRender();
				setup({}, storeWith('resolved'));

				expect(startUfoExperience).toHaveBeenCalledWith('smart-link-rendered', '123');
				expect((startUfoExperience as jest.Mock).mock.invocationCallOrder[0]).toBeLessThan(
					(componentModule.CardWithUrlContent as unknown as jest.Mock).mock.invocationCallOrder[0],
				);
			});
		});
	});

	describe('when intersecting', () => {
		const observe = jest.fn();
		const unobserve = jest.fn();
		const disconnect = jest.fn();

		beforeEach(() => {
			jest.restoreAllMocks();

			Object.defineProperty(window, 'IntersectionObserver', {
				writable: true,
				configurable: true,
				value: class MockIntersectionObserver implements IntersectionObserver {
					readonly root!: Element | null;
					readonly rootMargin!: string;
					readonly scrollMargin!: string;
					readonly thresholds!: ReadonlyArray<number>;

					constructor(callback: IntersectionObserverCallback) {
						observe.mockImplementation(() => {
							const entries = [
								{ isIntersecting: true, intersectionRatio: 1 },
							] as IntersectionObserverEntry[];

							callback(entries, this);
						});
					}
					takeRecords = jest.fn();
					observe = observe;
					unobserve = unobserve;
					disconnect = disconnect;
				},
			});
		});

		it('should immediately disconnect intersection observer if intersecting', async () => {
			const { unmount } = setup();

			expect(observe).toHaveBeenCalledTimes(1);
			expect(observe).toHaveBeenCalledWith(expect.any(HTMLDivElement));
			expect(disconnect).toHaveBeenCalledTimes(1);

			unmount();

			/**
			 * Called twice because the useEffect cleanup function
			 * also calls disconnect
			 */
			expect(disconnect).toHaveBeenCalledTimes(2);
		});

		it('should render the wrapped component after intersection', async () => {
			const spy = jest
				.spyOn(componentModule, 'CardWithUrlContent')
				.mockImplementation(() => <div />);

			const { unmount } = setup();

			expect(spy).toHaveBeenLastCalledWith(
				expect.objectContaining({ appearance: 'block', url: 'http://example.com' }),
				expect.anything(),
			);

			unmount();
		});

		it('should start the rendered experience once for a link settled on mount', () => {
			jest.spyOn(componentModule, 'CardWithUrlContent').mockImplementation(() => <div />);
			enableSettledRender();
			setup({}, storeWith('resolved'));

			expect(startUfoExperience).toHaveBeenCalledTimes(1);
		});
	});
});
