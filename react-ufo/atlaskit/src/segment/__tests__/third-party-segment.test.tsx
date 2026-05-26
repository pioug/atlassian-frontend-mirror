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

		describe('resource-timing event shaping', () => {
			it('shapes a cacheable (script) resource-timing event to only include consistent fields', () => {
				const { onRegisterIframeEventListener, getListener } = makeRegisterListener();

				renderWithContext(
					<UFOThirdPartySegment
						name="test-segment"
						onRegisterIframeEventListener={onRegisterIframeEventListener}
					>
						<div>Test content</div>
					</UFOThirdPartySegment>,
				);

				act(() => {
					getListener()({
						type: 'ufo-event',
						name: 'ufo-forge-resource-timing',
						elapsed: 500,
						payload: {
							name: 'https://forge.cdn.prod.atlassian-dev.net/main.js',
							initiatorType: 'script',
							startTime: 100,
							duration: 200,
							transferSize: 1024,
							encodedBodySize: 900,
							decodedBodySize: 1800,
							nextHopProtocol: 'h2',
							// timing sub-object — extra fields should be stripped
							timing: {
								fetchStart: 90,
								workerStart: 0,
								responseStart: 150,
								requestStart: 110,
								redirectStart: 0,
								redirectEnd: 0,
								domainLookupStart: 95,
								domainLookupEnd: 100,
								connectStart: 100,
								connectEnd: 110,
								secureConnectionStart: 105,
								responseEnd: 300,
							},
						},
					});
				});

				expect(mockAddIframeSegmentData).toHaveBeenCalledWith(
					'test-interaction-id',
					expect.anything(),
					{
						label: 'resource-timing',
						data: {
							// Base fields
							label: 'main.js',
							startTime: 100,
							duration: 200,
							fetchStart: 90,
							workerStart: 0,
							type: 'script',
							// Cacheable-specific fields
							transferType: 'network', // transferSize > 0
							ttfb: 150,
							encodedSize: 900,
							decodedSize: 1800,
							size: 1024,
						},
					},
				);
			});

			it('shapes a non-cacheable (fetch) resource-timing event to only include consistent fields', () => {
				const { onRegisterIframeEventListener, getListener } = makeRegisterListener();

				renderWithContext(
					<UFOThirdPartySegment
						name="test-segment"
						onRegisterIframeEventListener={onRegisterIframeEventListener}
					>
						<div>Test content</div>
					</UFOThirdPartySegment>,
				);

				act(() => {
					getListener()({
						type: 'ufo-event',
						name: 'ufo-forge-resource-timing',
						elapsed: 500,
						payload: {
							name: 'https://static.gliffy.com/shapes/index.json',
							initiatorType: 'fetch',
							startTime: 200,
							duration: 300,
							transferSize: 2048,
							encodedBodySize: 2000,
							decodedBodySize: 8000,
							nextHopProtocol: 'h2',
							// Extra timing fields that should be stripped
							timing: {
								fetchStart: 195,
								workerStart: 0,
								responseStart: 350,
								requestStart: 210,
								redirectStart: 0,
								domainLookupStart: 195,
								responseEnd: 500,
							},
						},
					});
				});

				expect(mockAddIframeSegmentData).toHaveBeenCalledWith(
					'test-interaction-id',
					expect.anything(),
					{
						label: 'resource-timing',
						data: {
							// Base fields
							label: 'index.json',
							startTime: 200,
							duration: 300,
							fetchStart: 195,
							workerStart: 0,
							type: 'fetch',
							// Non-cacheable specific fields
							ttfb: 350,
							requestStart: 210,
							size: 2048,
						},
					},
				);
			});

			it('marks a script with zero transferSize and zero duration as memory-cached', () => {
				const { onRegisterIframeEventListener, getListener } = makeRegisterListener();

				renderWithContext(
					<UFOThirdPartySegment
						name="test-segment"
						onRegisterIframeEventListener={onRegisterIframeEventListener}
					>
						<div>Test content</div>
					</UFOThirdPartySegment>,
				);

				act(() => {
					getListener()({
						type: 'ufo-event',
						name: 'ufo-forge-resource-timing',
						elapsed: 100,
						payload: {
							name: 'https://forge.cdn.prod.atlassian-dev.net/global-bridge.js',
							initiatorType: 'script',
							startTime: 10,
							duration: 0,
							transferSize: 0,
							encodedBodySize: 0,
							decodedBodySize: 0,
							nextHopProtocol: '',
							timing: {
								fetchStart: 9,
								workerStart: 0,
								responseStart: 0,
								requestStart: 0,
								responseEnd: 10,
							},
						},
					});
				});

				expect(mockAddIframeSegmentData).toHaveBeenCalledWith(
					'test-interaction-id',
					expect.anything(),
					expect.objectContaining({
						label: 'resource-timing',
						data: expect.objectContaining({ transferType: 'memory' }),
					}),
				);
			});

			it('marks a script with zero transferSize and non-zero duration as disk-cached', () => {
				const { onRegisterIframeEventListener, getListener } = makeRegisterListener();

				renderWithContext(
					<UFOThirdPartySegment
						name="test-segment"
						onRegisterIframeEventListener={onRegisterIframeEventListener}
					>
						<div>Test content</div>
					</UFOThirdPartySegment>,
				);

				act(() => {
					getListener()({
						type: 'ufo-event',
						name: 'ufo-forge-resource-timing',
						elapsed: 100,
						payload: {
							name: 'https://forge.cdn.prod.atlassian-dev.net/iframeResizer.contentWindow.min.js',
							initiatorType: 'script',
							startTime: 10,
							duration: 50,
							transferSize: 0,
							encodedBodySize: 0,
							decodedBodySize: 0,
							nextHopProtocol: '',
							timing: {
								fetchStart: 9,
								workerStart: 0,
								responseStart: 30,
								requestStart: 10,
								responseEnd: 60,
							},
						},
					});
				});

				expect(mockAddIframeSegmentData).toHaveBeenCalledWith(
					'test-interaction-id',
					expect.anything(),
					expect.objectContaining({
						label: 'resource-timing',
						data: expect.objectContaining({ transferType: 'disk' }),
					}),
				);
			});

			it('shapes a navigation-timing event to match NavigationMetrics field set', () => {
				const { onRegisterIframeEventListener, getListener } = makeRegisterListener();

				renderWithContext(
					<UFOThirdPartySegment
						name="test-segment"
						onRegisterIframeEventListener={onRegisterIframeEventListener}
					>
						<div>Test content</div>
					</UFOThirdPartySegment>,
				);

				act(() => {
					getListener()({
						type: 'ufo-event',
						name: 'ufo-forge-navigation-timing',
						elapsed: 6225,
						payload: {
							name: 'https://example.com/',
							startTime: 0,
							duration: 540.9,
							type: 'navigate',
							redirectCount: 0,
							timing: {
								unloadEventStart: 0,
								unloadEventEnd: 0,
								redirectStart: 0,
								redirectEnd: 0,
								fetchStart: 1.1,
								domainLookupStart: 1.1,
								domainLookupEnd: 1.1,
								connectStart: 1.1,
								connectEnd: 1.1,
								secureConnectionStart: 1.1,
								requestStart: 7.9,
								responseStart: 60.2,
								responseEnd: 61.7,
								// These should be dropped (same rationale as host-page)
								domInteractive: 516.9,
								domContentLoadedEventStart: 517,
								domContentLoadedEventEnd: 517.1,
								domComplete: 540.9,
								loadEventStart: 540.9,
								loadEventEnd: 540.9,
							},
							// pre-computed metrics — should be dropped
							metrics: {
								dns: 0,
								tcp: 0,
								ssl: 0,
								ttfb: 52.3,
								download: 1.5,
								domProcessing: 24,
								onload: 0,
							},
						},
					});
				});

				expect(mockAddIframeSegmentData).toHaveBeenCalledWith(
					'test-interaction-id',
					expect.anything(),
					{
						label: 'navigation-timing',
						data: {
							label: 'example.com',
							// Resource Timing fields — rounded
							redirectStart: 0,
							redirectEnd: 0,
							fetchStart: 1,
							domainLookupStart: 1,
							domainLookupEnd: 1,
							connectStart: 1,
							connectEnd: 1,
							secureConnectionStart: 1,
							requestStart: 8,
							responseStart: 60,
							responseEnd: 62,
							// Navigation Timing 2 fields
							redirectCount: 0,
							type: 'navigate',
							unloadEventStart: 0,
							unloadEventEnd: 0,
							workerStart: 0,
						},
					},
				);
			});

			it('does NOT shape non-resource-timing events (passes data through unchanged)', () => {
				const { onRegisterIframeEventListener, getListener } = makeRegisterListener();

				renderWithContext(
					<UFOThirdPartySegment
						name="test-segment"
						onRegisterIframeEventListener={onRegisterIframeEventListener}
					>
						<div>Test content</div>
					</UFOThirdPartySegment>,
				);

				act(() => {
					getListener()({
						type: 'ufo-event',
						name: 'ufo-forge-paint-timing',
						elapsed: 300,
						payload: {
							name: 'first-contentful-paint',
							startTime: 820,
							duration: 0,
							entryType: 'paint',
						},
					});
				});

				expect(mockAddIframeSegmentData).toHaveBeenCalledWith(
					'test-interaction-id',
					expect.anything(),
					{
						label: 'paint-timing',
						data: {
							name: 'ufo-forge-paint-timing',
							elapsed: 300,
							payload: {
								name: 'first-contentful-paint',
								startTime: 820,
								duration: 0,
								entryType: 'paint',
							},
						},
					},
				);
			});
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
