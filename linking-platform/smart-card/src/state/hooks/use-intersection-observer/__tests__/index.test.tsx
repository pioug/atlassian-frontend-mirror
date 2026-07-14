import React from 'react';

import { render } from '@atlassian/testing-library';

import useIntersectionObserver from '../index';

const TestComponent = (props: Parameters<typeof useIntersectionObserver>[0]) => {
	const ref = useIntersectionObserver(props);
	return <div ref={ref}>TestComponent</div>;
};

describe('useIntersectionObserver', () => {
	const setup = () => {
		const onIntersecting = jest.fn();
		const onIntersection = jest.fn();

		const renderResult = render(
			<TestComponent onIntersecting={onIntersecting} onIntersection={onIntersection} />,
		);

		return { ...renderResult, onIntersecting, onIntersection };
	};

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should capture and report a11y violations', async () => {
		const { container, unmount } = setup();
		await expect(container).toBeAccessible();
		unmount();
	});

	describe('when IntersectionObserver is not supported', () => {
		it('should not trigger onIntersecting and onIntersection callbacks', async () => {
			const { onIntersecting, onIntersection, unmount } = setup();

			expect(onIntersecting).not.toHaveBeenCalled();
			expect(onIntersection).not.toHaveBeenCalled();

			unmount();
		});
	});

	describe('when not intersecting', () => {
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
								{ isIntersecting: false, intersectionRatio: 1 },
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

		it('should not trigger onIntersecting but trigger onIntersection callbacks', async () => {
			const { onIntersecting, onIntersection, unmount } = setup();

			expect(onIntersecting).not.toHaveBeenCalled();
			expect(onIntersection).toHaveBeenCalledTimes(1);

			unmount();
		});

		it('should disconnect intersection observer when unmounting if never intersected', async () => {
			const { container, unmount } = setup();

			expect(observe).toHaveBeenCalledTimes(1);
			expect(observe).toHaveBeenCalledWith(expect.any(HTMLDivElement));
			expect(disconnect).toHaveBeenCalledTimes(0);

			unmount();

			expect(disconnect).toHaveBeenCalledTimes(1);

			await expect(container).toBeAccessible();
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

		it('should trigger onIntersecting and onIntersection callbacks', async () => {
			const { onIntersecting, onIntersection, unmount } = setup();

			expect(onIntersecting).toHaveBeenCalledTimes(1);
			expect(onIntersection).toHaveBeenCalledTimes(1);

			unmount();
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

		it('should not re-observe if onIntersecting callback reference changes', async () => {
			// Render with an unstable callback (new function reference each render)
			const { rerender } = render(<TestComponent onIntersecting={() => {}} />);

			expect(observe).toHaveBeenCalledTimes(1);

			// Re-render with a new function reference (simulates what happens when
			// a parent component's useCallback has changing deps)
			rerender(<TestComponent onIntersecting={() => {}} />);

			// observe should still only have been called once — the observer
			// must not be recreated just because the callback reference changed
			expect(observe).toHaveBeenCalledTimes(1);
		});
	});
});
