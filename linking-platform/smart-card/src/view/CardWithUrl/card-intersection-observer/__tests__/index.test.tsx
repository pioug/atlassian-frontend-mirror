import '@atlaskit/link-test-helpers/jest';

import React from 'react';

import { render, waitFor } from '@atlassian/testing-library';

import withCardIntersectionObserver from '../index';

jest.mock('../../../../state/hooks/use-smart-link-seen-event', () => ({
	useSmartLinkSeenEvent: jest.fn(() => ({
		onIntersecting: jest.fn(),
		onStatusSettled: jest.fn(),
	})),
}));

describe('withCardIntersectionObserver', () => {
	const InnerTestComponent = jest.fn(() => <div />);
	const TestComponent = withCardIntersectionObserver(InnerTestComponent);

	const setup = () => {
		const onEvent = jest.fn();

		const renderResult = render(<TestComponent appearance="inline" />);

		return { ...renderResult, onEvent };
	};

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should capture and report a11y violations', async () => {
		const { container, unmount } = setup();
		await expect(container).toBeAccessible();
		unmount();
	});

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
			const { container, unmount } = setup();

			expect(observe).toHaveBeenCalledTimes(1);
			expect(observe).toHaveBeenCalledWith(expect.any(HTMLSpanElement));
			expect(disconnect).toHaveBeenCalledTimes(0);

			unmount();

			expect(disconnect).toHaveBeenCalledTimes(1);

			await expect(container).toBeAccessible();
		});

		it('should render the wrapped component before intersection', () => {
			setup();

			expect(InnerTestComponent).toHaveBeenCalledWith(
				expect.objectContaining({ appearance: 'inline' }),
				expect.anything(),
			);
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
			observe.mockClear();
			disconnect.mockClear();

			const { unmount } = setup();

			expect(observe).toHaveBeenCalledTimes(1);
			expect(observe).toHaveBeenCalledWith(expect.any(HTMLSpanElement));
			expect(disconnect).toHaveBeenCalledTimes(1);

			unmount();

			/**
			 * Called twice because the useEffect cleanup function
			 * also calls disconnect
			 */
			expect(disconnect).toHaveBeenCalledTimes(2);
		});

		it('should render the wrapped component after intersection', async () => {
			setup();

			await waitFor(() => {
				expect(InnerTestComponent).toHaveBeenLastCalledWith(
					expect.objectContaining({ appearance: 'inline' }),
					expect.anything(),
				);
			});
		});
	});
});
