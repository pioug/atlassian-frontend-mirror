import '@atlaskit/link-test-helpers/jest';
import React from 'react';

import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { renderWithIntl } from '@atlaskit/link-test-helpers/react-testing-library';
import { ResolvedClient } from '@atlaskit/link-test-helpers/smart-card/mocks/clients';
import { type CardStore } from '@atlaskit/linking-common/store';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { startUfoExperience } from '../../../../state/analytics/startUfoExperience';
import { ANALYTICS_CHANNEL } from '../../../../utils/analytics/analytics';
import { shouldSample } from '../../../../utils/shouldSample';
import * as componentModule from '../../component';
import { LazyIntersectionObserverCard } from '../LazyIntersectionObserverCard';

type CardAppearance = React.ComponentProps<typeof LazyIntersectionObserverCard>['appearance'];

const mockUsePrefetch = jest.fn((_url: string, _appearance: CardAppearance) => jest.fn());
jest.mock('../../../../state/hooks/usePrefetch', () => ({
	usePrefetch: (url: string, appearance: CardAppearance) => mockUsePrefetch(url, appearance),
}));

jest.mock('../../../../state/analytics/startUfoExperience', () => ({
	startUfoExperience: jest.fn(),
}));

jest.mock('../../../../utils/shouldSample', () => ({
	shouldSample: jest.fn(),
}));

jest.mock('@atlaskit/platform-feature-flags/fg', () => ({
	...jest.requireActual('@atlaskit/platform-feature-flags/fg'),
	fg: jest.fn(),
}));

describe('LazyIntersectionObserverCard', () => {
	afterEach(() => {
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
		(fg as jest.Mock).mockImplementation(
			(flag: string) => flag === 'platform_smartlink_render_settled_link_on_mount',
		);
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

		it('should disconnect intersection observer when unmounting if never intersected', async () => {
			const { unmount } = setup();

			expect(observe).toHaveBeenCalledTimes(1);
			expect(observe).toHaveBeenCalledWith(expect.any(HTMLDivElement));
			expect(disconnect).toHaveBeenCalledTimes(0);

			unmount();

			expect(disconnect).toHaveBeenCalledTimes(1);
		});

		it('should prefetch data for the card appearance', () => {
			setup({ appearance: 'inline' });

			expect(mockUsePrefetch).toHaveBeenCalledWith('http://example.com', 'inline');
		});

		describe('when the store has the link on mount', () => {
			beforeEach(() => {
				jest
					.spyOn(componentModule, 'CardWithUrlContent')
					.mockImplementation(() => <div data-testid="card-content" />);
			});

			afterEach(() => {
				jest.restoreAllMocks();
			});

			it.each(['resolved', 'unauthorized', 'forbidden', 'not_found'] as const)(
				'should render a %s link at once and still observe it',
				(status) => {
					(fg as jest.Mock).mockImplementation(
						(flag: string) => flag === 'platform_smartlink_render_settled_link_on_mount',
					);
					const { queryByTestId } = setup({}, storeWith(status));

					expect(queryByTestId('card-content')).toBeInTheDocument();
					expect(queryByTestId('lazy-render-placeholder')).not.toBeInTheDocument();
					expect(observe).toHaveBeenCalledWith(expect.any(HTMLDivElement));
				},
			);

			it('should render the placeholder for a link that is still resolving', () => {
				(fg as jest.Mock).mockReturnValue(true);
				const { queryByTestId } = setup({}, storeWith('resolving'));

				expect(queryByTestId('card-content')).not.toBeInTheDocument();
				expect(queryByTestId('lazy-render-placeholder')).toBeInTheDocument();
			});

			it('should render the placeholder when the gate is off', () => {
				(fg as jest.Mock).mockReturnValue(false);
				const { queryByTestId } = setup({}, storeWith('resolved'));

				expect(queryByTestId('card-content')).not.toBeInTheDocument();
				expect(queryByTestId('lazy-render-placeholder')).toBeInTheDocument();
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
