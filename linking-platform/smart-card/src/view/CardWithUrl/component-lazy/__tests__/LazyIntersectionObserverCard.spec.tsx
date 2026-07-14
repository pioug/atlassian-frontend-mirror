import '@atlaskit/link-test-helpers/jest';
import React from 'react';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { renderWithIntl, ResolvedClient } from '@atlaskit/link-test-helpers';

import { ANALYTICS_CHANNEL } from '../../../../utils/analytics';
import * as componentModule from '../../component';
import { LazyIntersectionObserverCard } from '../LazyIntersectionObserverCard';

describe('LazyIntersectionObserverCard', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	const setup = (
		props: Partial<React.ComponentProps<typeof LazyIntersectionObserverCard>> = {},
	) => {
		const onEvent = jest.fn();

		const renderResult = renderWithIntl(
			<SmartCardProvider client={new ResolvedClient()}>
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
	});
});
