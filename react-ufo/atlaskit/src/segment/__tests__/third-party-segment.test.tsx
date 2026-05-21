import React from 'react';

import { act, render } from '@atlassian/testing-library';

import UFOInteractionContext from '../../interaction-context';
import UFOInteractionIDContext, { DefaultInteractionID } from '../../interaction-id-context';
import { UFOThirdPartySegment } from '../third-party-segment';

// Mock UFOSegment component
jest.mock('../segment', () => {
	const MockUFOSegment = ({ children, type, name, ...props }: any) => {
		// Store the props in a global variable for testing
		(window as any).__mockUFOSegmentProps = { type, name, ...props };
		return <div data-testid="mock-ufo-segment">{children}</div>;
	};
	MockUFOSegment.displayName = 'UFOSegment';
	return {
		__esModule: true,
		default: MockUFOSegment,
	};
});

// Mock feature flags
jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(() => {
		return false;
	}),
}));

// Mock interaction-metrics so we can spy on addIframeSegmentData
const mockAddIframeSegmentData = jest.fn();
const mockAddCompletedHold = jest.fn();
jest.mock('../../interaction-metrics', () => ({
	addIframeSegmentData: (...args: any[]) => mockAddIframeSegmentData(...args),
	addCompletedHold: (...args: any[]) => mockAddCompletedHold(...args),
	addSegmentExtraData: jest.fn(),
	getActiveInteraction: jest.fn(() => null),
}));

describe('UFOThirdPartySegment', () => {
	beforeEach(() => {
		// Clear the stored props before each test
		(window as any).__mockUFOSegmentProps = null;
		mockAddIframeSegmentData.mockClear();
		mockAddCompletedHold.mockClear();
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('should have the correct displayName', () => {
		expect(UFOThirdPartySegment.displayName).toBe('UFOThirdPartySegment');
	});

	it('should call UFOSegment with type="third-party"', async () => {
		render(
			<UFOThirdPartySegment name="test-segment">
				<div>Test content</div>
			</UFOThirdPartySegment>,
		);

		// Get the props that were passed to UFOSegment
		const ufoSegmentProps = (window as any).__mockUFOSegmentProps;

		// Verify UFOSegment was called with the correct props
		expect(ufoSegmentProps).toBeDefined();
		expect(ufoSegmentProps.type).toBe('third-party');
		expect(ufoSegmentProps.name).toBe('test-segment');

		await expect(document.body).toBeAccessible();
	});

	it('should render children within UFOSegment', async () => {
		const { getByTestId, getByText } = render(
			<UFOThirdPartySegment name="test-segment">
				<div>Test content</div>
			</UFOThirdPartySegment>,
		);

		// Verify UFOSegment was rendered
		expect(getByTestId('mock-ufo-segment')).toBeInTheDocument();

		// Verify children were rendered
		expect(getByText('Test content')).toBeInTheDocument();

		await expect(document.body).toBeAccessible();
	});

	describe('IframeSegment abort timeout', () => {
		beforeEach(() => {
			// Provide a non-null interaction ID so the addIframeSegmentData guard passes.
			DefaultInteractionID.current = 'test-interaction-id';
		});

		afterEach(() => {
			DefaultInteractionID.current = null;
		});

		const mockInteractionContext = {
			hold: jest.fn(),
			tracePress: jest.fn(),
			labelStack: [{ name: 'test-segment', segmentId: 'test-segment-id' }],
			segmentIdMap: new Map(),
			addMark: jest.fn(),
			addCustomData: jest.fn(),
			addCustomTimings: jest.fn(),
			addApdex: jest.fn(),
		} as any;

		const renderWithContext = (ui: React.ReactElement) =>
			render(
				<UFOInteractionIDContext.Provider value={DefaultInteractionID}>
					<UFOInteractionContext.Provider value={mockInteractionContext}>
						{ui}
					</UFOInteractionContext.Provider>
				</UFOInteractionIDContext.Provider>,
			);

		const makeRegisterListener = () => {
			let capturedListener: ((event: any) => void) | null = null;
			const onRegisterIframeEventListener = jest.fn((listener: (event: any) => void) => {
				capturedListener = listener;
				return jest.fn();
			});
			return {
				onRegisterIframeEventListener,
				getListener: () => capturedListener!,
			};
		};

		it('should abort after 6s when NO recognised iframe events are received (old rollout cohort)', () => {
			const { onRegisterIframeEventListener } = makeRegisterListener();

			renderWithContext(
				<UFOThirdPartySegment
					name="test-segment"
					onRegisterIframeEventListener={onRegisterIframeEventListener}
				>
					<div>Test content</div>
				</UFOThirdPartySegment>,
			);

			// Advance to just before the 6 s threshold — no abort yet.
			act(() => {
				jest.advanceTimersByTime(5_999);
			});
			expect(mockAddIframeSegmentData).not.toHaveBeenCalledWith(
				expect.anything(),
				expect.anything(),
				expect.objectContaining({ label: 'segment-timing-abort' }),
			);

			// Advance past 6 s — abort fires with the initial timeout value.
			act(() => {
				jest.advanceTimersByTime(1);
			});
			expect(mockAddIframeSegmentData).toHaveBeenCalledWith(
				'test-interaction-id',
				expect.anything(),
				expect.objectContaining({
					label: 'segment-timing-abort',
					data: expect.objectContaining({ reason: 'timeout', abortAfterMs: 6_000 }),
				}),
			);
		});

		it('should extend abort to 60 s when a recognised iframe event arrives within 6 s (new rollout cohort)', () => {
			const { onRegisterIframeEventListener, getListener } = makeRegisterListener();

			renderWithContext(
				<UFOThirdPartySegment
					name="test-segment"
					onRegisterIframeEventListener={onRegisterIframeEventListener}
				>
					<div>Test content</div>
				</UFOThirdPartySegment>,
			);

			// Simulate a recognised event arriving at 3 s — within the initial 6s window.
			act(() => {
				jest.advanceTimersByTime(3_000);
				getListener()({
					type: 'ufo-event',
					name: 'ufo-forge-app-resource-timing',
					elapsed: 3000,
				});
			});

			// Advance past the original 6 s mark — abort should NOT have fired yet.
			act(() => {
				jest.advanceTimersByTime(2_001);
			});
			expect(mockAddIframeSegmentData).not.toHaveBeenCalledWith(
				expect.anything(),
				expect.anything(),
				expect.objectContaining({ label: 'segment-timing-abort' }),
			);

			// Advance to the full 60 s mark from mount (57 s remaining after the extension).
			// The extended timer runs for ABORT_TIMEOUT_EXTENDED_MS - ABORT_TIMEOUT_INITIAL_MS = 54 s
			// from when the first event arrived at 3 s, so fires at 3 + 54 = 57 s from mount.
			act(() => {
				jest.advanceTimersByTime(54_000);
			});
			expect(mockAddIframeSegmentData).toHaveBeenCalledWith(
				'test-interaction-id',
				expect.anything(),
				expect.objectContaining({
					label: 'segment-timing-abort',
					data: expect.objectContaining({ reason: 'timeout', abortAfterMs: 60_000 }),
				}),
			);
		});

		it('should NOT abort at all when navigation-timing event is received (natural hold release)', () => {
			const { onRegisterIframeEventListener, getListener } = makeRegisterListener();

			renderWithContext(
				<UFOThirdPartySegment
					name="test-segment"
					onRegisterIframeEventListener={onRegisterIframeEventListener}
				>
					<div>Test content</div>
				</UFOThirdPartySegment>,
			);

			// Simulate the iframe sending navigation-timing at 2 s — hold releases naturally.
			act(() => {
				jest.advanceTimersByTime(2_000);
				getListener()({
					type: 'ufo-event',
					name: 'ufo-forge-app-navigation-timing',
					elapsed: 2000,
				});
			});

			// Advance well past both the 6s and 60 s marks — no abort should ever fire.
			act(() => {
				jest.advanceTimersByTime(60_000);
			});
			expect(mockAddIframeSegmentData).not.toHaveBeenCalledWith(
				expect.anything(),
				expect.anything(),
				expect.objectContaining({ label: 'segment-timing-abort' }),
			);
		});
	});
});
