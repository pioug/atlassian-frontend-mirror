import '@atlaskit/link-test-helpers/jest';
import React from 'react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { render, waitFor } from '@atlassian/testing-library/testing-library/react';

import { startUfoExperience } from '../../../../state/analytics/startUfoExperience';
import { clearMarks } from '../../../../utils/clear-marks';
import { clearMeasures } from '../../../../utils/clear-measures';
import withCardIntersectionObserver from '../index';

jest.mock('../../../../state/analytics/startUfoExperience', () => ({
	startUfoExperience: jest.fn(),
}));
jest.mock('../../../../utils/shouldSample', () => ({
	shouldSample: jest.fn(() => true),
}));
jest.mock('../../../../utils/clear-marks', () => ({
	clearMarks: jest.fn(),
}));
jest.mock('../../../../utils/clear-measures', () => ({
	clearMeasures: jest.fn(),
}));

jest.mock('../../../../state/hooks/use-smart-link-seen-event', () => ({
	useSmartLinkSeenEvent: jest.fn(() => ({
		onIntersecting: jest.fn(),
		onStatusSettled: jest.fn(),
	})),
}));

describe('withCardIntersectionObserver', () => {
	const InnerTestComponent = jest.fn(() => <div />);
	const TestComponent = withCardIntersectionObserver(InnerTestComponent);

	const setup = (props?: { id?: string }) => {
		const onEvent = jest.fn();

		const renderResult = render(<TestComponent appearance="inline" {...props} />);

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

	describe('marks and measures cleanup on unmount', () => {
		const gate = 'platform_smartlink_cardssr_missing_events';

		it('should clear marks and measures on unmount when gate is enabled', () => {
			passGate(gate);
			const { unmount } = setup({ id: 'some-id' });

			expect(clearMarks).not.toHaveBeenCalled();
			expect(clearMeasures).not.toHaveBeenCalled();

			unmount();

			expect(clearMarks).toHaveBeenCalledWith('some-id');
			expect(clearMeasures).toHaveBeenCalledWith('some-id');
		});

		it('should not clear marks and measures on unmount without id when gate is enabled', () => {
			passGate(gate);
			const { unmount } = setup();

			unmount();

			expect(clearMarks).not.toHaveBeenCalled();
			expect(clearMeasures).not.toHaveBeenCalled();
		});

		it('should not clear marks and measures on unmount when gate is disabled', () => {
			failGate(gate);
			const { unmount } = setup({ id: 'some-id' });

			unmount();

			expect(clearMarks).not.toHaveBeenCalled();
			expect(clearMeasures).not.toHaveBeenCalled();
		});
	});

	describe('smart-link-rendered experience', () => {
		const gate = 'platform_smartlink_cardssr_missing_events';

		it('should start the experience once in StrictMode when gate is enabled', () => {
			passGate(gate);
			render(
				<React.StrictMode>
					<TestComponent appearance="inline" id="some-id" />
				</React.StrictMode>,
			);

			expect(startUfoExperience).toHaveBeenCalledTimes(1);
			expect(startUfoExperience).toHaveBeenCalledWith(
				'smart-link-rendered',
				'some-id',
				expect.objectContaining({ ssr: true }),
				undefined,
			);
		});

		it('should not start the experience when gate is disabled', () => {
			failGate(gate);
			render(<TestComponent appearance="inline" id="some-id" />);

			expect(startUfoExperience).not.toHaveBeenCalled();
		});
	});
});
