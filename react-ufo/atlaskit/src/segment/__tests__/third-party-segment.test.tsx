import React from 'react';

import { act, render, screen } from '@atlassian/testing-library';

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

// Mock feature flags.
jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(() => false),
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
		render(
			<UFOThirdPartySegment name="test-segment">
				<div>Test content</div>
			</UFOThirdPartySegment>,
		);

		// Verify UFOSegment was rendered
		expect(screen.getByTestId('mock-ufo-segment')).toBeInTheDocument();

		// Verify children were rendered
		expect(screen.getByText('Test content')).toBeInTheDocument();

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
					extraData={{ appType: 'CustomUI' }}
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
					extraData={{ appType: 'CustomUI' }}
				>
					<div>Test content</div>
				</UFOThirdPartySegment>,
			);

			// Simulate the ufo-forge-init early signal arriving at 3 s — within the initial 6s window.
			act(() => {
				jest.advanceTimersByTime(3_000);
				getListener()({
					type: 'ufo-event',
					name: 'ufo-forge-init',
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

			// Advance past the full 30 s mark from mount.
			// The code computes remainingMs = ABORT_TIMEOUT_EXTENDED_MS - elapsed = 30000 - 3000 = 27000 ms
			// from the moment the event arrived at 3 s, so the abort fires at 3 + 27 = 30 s from mount.
			// We've already advanced 3000 + 2001 = 5001 ms, so we need at least 24999 ms more.
			act(() => {
				jest.advanceTimersByTime(25_000);
			});
			expect(mockAddIframeSegmentData).toHaveBeenCalledWith(
				'test-interaction-id',
				expect.anything(),
				expect.objectContaining({
					label: 'segment-timing-abort',
					data: expect.objectContaining({ reason: 'timeout', abortAfterMs: 30_000 }),
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
						extraData={{ appType: 'CustomUI' }}
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
						extraData={{ appType: 'CustomUI' }}
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
						extraData={{ appType: 'CustomUI' }}
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
						extraData={{ appType: 'CustomUI' }}
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
						extraData={{ appType: 'CustomUI' }}
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
							encodedBodySize: 0,
							decodedBodySize: 0,
							transferSize: 0,
							nextHopProtocol: undefined,
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

			it('shapes paint-timing to only { name, startTime } — dropping elapsed, entryType, duration', () => {
				const { onRegisterIframeEventListener, getListener } = makeRegisterListener();

				renderWithContext(
					<UFOThirdPartySegment
						name="test-segment"
						onRegisterIframeEventListener={onRegisterIframeEventListener}
						extraData={{ appType: 'CustomUI' }}
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
							startTime: 820.7,
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
							name: 'first-contentful-paint',
							startTime: 821,
						},
					},
				);
			});

			it('shapes largest-contentful-paint to only { startTime, size } — dropping elapsed and other fields', () => {
				const { onRegisterIframeEventListener, getListener } = makeRegisterListener();

				renderWithContext(
					<UFOThirdPartySegment
						name="test-segment"
						onRegisterIframeEventListener={onRegisterIframeEventListener}
						extraData={{ appType: 'CustomUI' }}
					>
						<div>Test content</div>
					</UFOThirdPartySegment>,
				);

				act(() => {
					getListener()({
						type: 'ufo-event',
						name: 'ufo-forge-largest-contentful-paint',
						elapsed: 500,
						payload: {
							startTime: 1234.7,
							size: 20000,
						},
					});
				});

				expect(mockAddIframeSegmentData).toHaveBeenCalledWith(
					'test-interaction-id',
					expect.anything(),
					{
						label: 'largest-contentful-paint',
						data: {
							startTime: 1235,
							size: 20000,
						},
					},
				);
			});

			it('shapes layout-shift — drops rects, hadRecentInput, duration, lastInputTime; keeps only node tagName in sources', () => {
				const { onRegisterIframeEventListener, getListener } = makeRegisterListener();

				renderWithContext(
					<UFOThirdPartySegment
						name="test-segment"
						onRegisterIframeEventListener={onRegisterIframeEventListener}
						extraData={{ appType: 'CustomUI' }}
					>
						<div>Test content</div>
					</UFOThirdPartySegment>,
				);

				act(() => {
					getListener()({
						type: 'ufo-event',
						name: 'ufo-forge-layout-shift',
						elapsed: 200,
						payload: {
							value: 0.15,
							startTime: 200.8,
							duration: 0,
							hadRecentInput: false,
							lastInputTime: 0,
							cumulativeScore: 0.25,
							sessionValue: 0.15,
							sources: [
								{
									node: 'DIV',
									currentRect: { x: 10, y: 20, width: 100, height: 50 },
									previousRect: { x: 0, y: 0, width: 100, height: 50 },
								},
								{
									node: 'SPAN',
									currentRect: { x: 5, y: 5, width: 30, height: 10 },
									previousRect: { x: 0, y: 0, width: 30, height: 10 },
								},
							],
						},
					});
				});

				expect(mockAddIframeSegmentData).toHaveBeenCalledWith(
					'test-interaction-id',
					expect.anything(),
					{
						label: 'layout-shift',
						data: {
							value: 0.15,
							startTime: 201,
							cumulativeScore: 0.25,
							sessionValue: 0.15,
							sources: [{ node: 'DIV' }, { node: 'SPAN' }],
						},
					},
				);
			});

			it('layout-shift: handles missing sources array gracefully', () => {
				const { onRegisterIframeEventListener, getListener } = makeRegisterListener();

				renderWithContext(
					<UFOThirdPartySegment
						name="test-segment"
						onRegisterIframeEventListener={onRegisterIframeEventListener}
						extraData={{ appType: 'CustomUI' }}
					>
						<div>Test content</div>
					</UFOThirdPartySegment>,
				);

				act(() => {
					getListener()({
						type: 'ufo-event',
						name: 'ufo-forge-layout-shift',
						elapsed: 100,
						payload: {
							value: 0.1,
							startTime: 100,
							cumulativeScore: 0.1,
							sessionValue: 0.1,
							// no sources field
						},
					});
				});

				expect(mockAddIframeSegmentData).toHaveBeenCalledWith(
					'test-interaction-id',
					expect.anything(),
					{
						label: 'layout-shift',
						data: {
							value: 0.1,
							startTime: 100,
							cumulativeScore: 0.1,
							sessionValue: 0.1,
							sources: [],
						},
					},
				);
			});

			it('dom-mutations: skips intermediate batches (isFinalBatch:false) and only stores the final batch', () => {
				const { onRegisterIframeEventListener, getListener } = makeRegisterListener();

				renderWithContext(
					<UFOThirdPartySegment
						name="test-segment"
						onRegisterIframeEventListener={onRegisterIframeEventListener}
						extraData={{ appType: 'CustomUI' }}
					>
						<div>Test content</div>
					</UFOThirdPartySegment>,
				);

				// Intermediate batch — should NOT be stored
				act(() => {
					getListener()({
						type: 'ufo-event',
						name: 'ufo-forge-dom-mutations',
						elapsed: 50,
						payload: {
							mutationCount: 3,
							totalMutations: 3,
							timeSinceLastMutation: 10,
							timestamp: 50,
							observationDurationMs: 50,
							isTimedOut: false,
							isFinalBatch: false,
							stopReason: null,
							mutations: [{ type: 'childList', target: { tagName: 'DIV', className: '', id: '' } }],
						},
					});
				});

				expect(mockAddIframeSegmentData).not.toHaveBeenCalledWith(
					expect.anything(),
					expect.anything(),
					expect.objectContaining({ label: 'dom-mutations' }),
				);

				// Final batch — SHOULD be stored with shaped summary only
				act(() => {
					getListener()({
						type: 'ufo-event',
						name: 'ufo-forge-dom-mutations',
						elapsed: 350,
						payload: {
							mutationCount: 2,
							totalMutations: 5,
							timeSinceLastMutation: 300,
							timestamp: 350,
							observationDurationMs: 350.7,
							isTimedOut: false,
							isFinalBatch: true,
							stopReason: 'idle',
							mutations: [],
						},
					});
				});

				expect(mockAddIframeSegmentData).toHaveBeenCalledTimes(1);
				expect(mockAddIframeSegmentData).toHaveBeenCalledWith(
					'test-interaction-id',
					expect.anything(),
					{
						label: 'dom-mutations',
						data: {
							totalMutations: 5,
							observationDurationMs: 351,
							stopReason: 'idle',
						},
					},
				);
			});

			it('dom-mutations: intermediate batch still extends abort timer to 60s', () => {
				const { onRegisterIframeEventListener, getListener } = makeRegisterListener();

				renderWithContext(
					<UFOThirdPartySegment
						name="test-segment"
						onRegisterIframeEventListener={onRegisterIframeEventListener}
						extraData={{ appType: 'CustomUI' }}
					>
						<div>Test content</div>
					</UFOThirdPartySegment>,
				);

				// Send intermediate batch within the initial 6s window
				act(() => {
					jest.advanceTimersByTime(3_000);
					getListener()({
						type: 'ufo-event',
						name: 'ufo-forge-dom-mutations',
						elapsed: 3000,
						payload: {
							mutationCount: 1,
							totalMutations: 1,
							timeSinceLastMutation: 0,
							timestamp: 3000,
							observationDurationMs: 3000,
							isTimedOut: false,
							isFinalBatch: false,
							stopReason: null,
							mutations: [],
						},
					});
				});

				// Should abort at 6s — intermediate dom-mutations batch no longer extends the timer.
				// Only ufo-forge-init extends the abort window.
				act(() => {
					jest.advanceTimersByTime(3_001);
				});
				expect(mockAddIframeSegmentData).toHaveBeenCalledWith(
					expect.anything(),
					expect.anything(),
					expect.objectContaining({
						label: 'segment-timing-abort',
						data: expect.objectContaining({ abortAfterMs: 6_000 }),
					}),
				);
			});
		});

		it('should NOT abort at all when navigation-timing event is received (natural hold release)', () => {
			const { onRegisterIframeEventListener, getListener } = makeRegisterListener();

			renderWithContext(
				<UFOThirdPartySegment
					name="test-segment"
					onRegisterIframeEventListener={onRegisterIframeEventListener}
					extraData={{ appType: 'CustomUI' }}
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

		describe('resized event ingestion (from useResizeAnalytics)', () => {
			it('forwards a resized event with only { height, elapsed }', () => {
				const { onRegisterIframeEventListener, getListener } = makeRegisterListener();

				renderWithContext(
					<UFOThirdPartySegment
						name="test-segment"
						onRegisterIframeEventListener={onRegisterIframeEventListener}
						extraData={{ appType: 'CustomUI' }}
					>
						<div>Test content</div>
					</UFOThirdPartySegment>,
				);

				act(() => {
					getListener()({
						type: 'resized',
						height: 384,
						measuredHeight: null,
						viewportHeight: null,
						elapsed: 850,
					});
				});

				expect(mockAddIframeSegmentData).toHaveBeenCalledWith(
					'test-interaction-id',
					expect.anything(),
					expect.objectContaining({
						label: 'resized',
						data: { height: 384, elapsed: 850 },
					}),
				);
			});

			it('forwards multiple resized events as separate timeline entries', () => {
				const { onRegisterIframeEventListener, getListener } = makeRegisterListener();

				renderWithContext(
					<UFOThirdPartySegment
						name="test-segment"
						onRegisterIframeEventListener={onRegisterIframeEventListener}
						extraData={{ appType: 'CustomUI' }}
					>
						<div>Test content</div>
					</UFOThirdPartySegment>,
				);

				act(() => {
					getListener()({ type: 'resized', height: 0, elapsed: 102 });
					getListener()({ type: 'resized', height: 384, elapsed: 850 });
					getListener()({ type: 'resized', height: 412, elapsed: 1245 });
				});

				const resizedCalls = mockAddIframeSegmentData.mock.calls.filter(
					(call) => call[2]?.label === 'resized',
				);
				expect(resizedCalls).toHaveLength(3);
				expect(resizedCalls[0][2].data).toEqual({ height: 0, elapsed: 102 });
				expect(resizedCalls[1][2].data).toEqual({ height: 384, elapsed: 850 });
				expect(resizedCalls[2][2].data).toEqual({ height: 412, elapsed: 1245 });
			});

			it('ignores resized events with malformed payload (missing height)', () => {
				const { onRegisterIframeEventListener, getListener } = makeRegisterListener();

				renderWithContext(
					<UFOThirdPartySegment
						name="test-segment"
						onRegisterIframeEventListener={onRegisterIframeEventListener}
						extraData={{ appType: 'CustomUI' }}
					>
						<div>Test content</div>
					</UFOThirdPartySegment>,
				);

				act(() => {
					getListener()({ type: 'resized', elapsed: 500 });
				});

				expect(mockAddIframeSegmentData).not.toHaveBeenCalledWith(
					expect.anything(),
					expect.anything(),
					expect.objectContaining({ label: 'resized' }),
				);
			});

			it('caps resized entries per segment at the defence-in-depth limit', () => {
				const { onRegisterIframeEventListener, getListener } = makeRegisterListener();

				renderWithContext(
					<UFOThirdPartySegment
						name="test-segment"
						onRegisterIframeEventListener={onRegisterIframeEventListener}
						extraData={{ appType: 'CustomUI' }}
					>
						<div>Test content</div>
					</UFOThirdPartySegment>,
				);

				// Fire 60 resized events; only the first 50 should be forwarded
				// (MAX_RESIZED_ENTRIES_PER_SEGMENT = 50).
				act(() => {
					for (let i = 0; i < 60; i++) {
						getListener()({ type: 'resized', height: 100 + i, elapsed: 100 + i });
					}
				});

				const resizedCalls = mockAddIframeSegmentData.mock.calls.filter(
					(call) => call[2]?.label === 'resized',
				);
				expect(resizedCalls).toHaveLength(50);
				// First entry preserved; entry 51..60 dropped.
				expect(resizedCalls[0][2].data).toEqual({ height: 100, elapsed: 100 });
				expect(resizedCalls[49][2].data).toEqual({ height: 149, elapsed: 149 });
			});

			it('resets the per-segment cap when segmentId changes (SPA navigation)', () => {
				const { onRegisterIframeEventListener, getListener } = makeRegisterListener();

				const { rerender } = render(
					<UFOInteractionIDContext.Provider value={DefaultInteractionID}>
						<UFOInteractionContext.Provider value={mockInteractionContext}>
							<UFOThirdPartySegment
								name="test-segment"
								onRegisterIframeEventListener={onRegisterIframeEventListener}
								extraData={{ appType: 'CustomUI' }}
							>
								<div>Test content</div>
							</UFOThirdPartySegment>
						</UFOInteractionContext.Provider>
					</UFOInteractionIDContext.Provider>,
				);

				// Burn through the full 50-event budget on segment A.
				act(() => {
					for (let i = 0; i < 50; i++) {
						getListener()({ type: 'resized', height: 100 + i, elapsed: 100 + i });
					}
				});

				// Confirm a further event on segment A is dropped (cap hit).
				act(() => {
					getListener()({ type: 'resized', height: 999, elapsed: 999 });
				});

				const beforeNav = mockAddIframeSegmentData.mock.calls.filter(
					(call) => call[2]?.label === 'resized',
				);
				expect(beforeNav).toHaveLength(50);

				// Simulate an SPA navigation: swap the active segmentId via the
				// labelStack and re-render. This causes IframeSegmentIdReader to
				// update segmentIdRef.current to the new value.
				const swappedContext = {
					...mockInteractionContext,
					labelStack: [{ name: 'test-segment', segmentId: 'segment-B' }],
				};

				rerender(
					<UFOInteractionIDContext.Provider value={DefaultInteractionID}>
						<UFOInteractionContext.Provider value={swappedContext}>
							<UFOThirdPartySegment
								name="test-segment"
								onRegisterIframeEventListener={onRegisterIframeEventListener}
								extraData={{ appType: 'CustomUI' }}
							>
								<div>Test content</div>
							</UFOThirdPartySegment>
						</UFOInteractionContext.Provider>
					</UFOInteractionIDContext.Provider>,
				);

				// On the new segment, a fresh budget should apply: 50 more events forward.
				act(() => {
					for (let i = 0; i < 50; i++) {
						getListener()({ type: 'resized', height: 200 + i, elapsed: 200 + i });
					}
				});

				const afterNav = mockAddIframeSegmentData.mock.calls.filter(
					(call) => call[2]?.label === 'resized',
				);
				expect(afterNav).toHaveLength(100);
				// New entries went to segment-B.
				expect(afterNav[50][1]).toBe('segment-B');
				expect(afterNav[99][2].data).toEqual({ height: 249, elapsed: 249 });
			});

			it('ignores resized events with negative elapsed values', () => {
				const { onRegisterIframeEventListener, getListener } = makeRegisterListener();

				renderWithContext(
					<UFOThirdPartySegment
						name="test-segment"
						onRegisterIframeEventListener={onRegisterIframeEventListener}
						extraData={{ appType: 'CustomUI' }}
					>
						<div>Test content</div>
					</UFOThirdPartySegment>,
				);

				act(() => {
					getListener()({ type: 'resized', height: 240, elapsed: -100 });
				});

				expect(mockAddIframeSegmentData).not.toHaveBeenCalledWith(
					expect.anything(),
					expect.anything(),
					expect.objectContaining({ label: 'resized' }),
				);
			});

			it('drops resized events that arrive before segmentIdRef is populated', () => {
				const { onRegisterIframeEventListener, getListener } = makeRegisterListener();

				// Render with a context whose labelStack has no segmentId yet,
				// so IframeSegmentIdReader cannot populate segmentIdRef.current.
				const emptyContext = {
					...mockInteractionContext,
					labelStack: [],
				};

				render(
					<UFOInteractionIDContext.Provider value={DefaultInteractionID}>
						<UFOInteractionContext.Provider value={emptyContext}>
							<UFOThirdPartySegment
								name="test-segment"
								onRegisterIframeEventListener={onRegisterIframeEventListener}
								extraData={{ appType: 'CustomUI' }}
							>
								<div>Test content</div>
							</UFOThirdPartySegment>
						</UFOInteractionContext.Provider>
					</UFOInteractionIDContext.Provider>,
				);

				// Fire a well-formed resized event before any segmentId is set.
				act(() => {
					getListener()({ type: 'resized', height: 240, elapsed: 100 });
				});

				// Guard should silently drop it: no addIframeSegmentData call for this event.
				expect(mockAddIframeSegmentData).not.toHaveBeenCalledWith(
					expect.anything(),
					expect.anything(),
					expect.objectContaining({ label: 'resized' }),
				);
			});

			it('ignores resized events with malformed payload (missing elapsed)', () => {
				const { onRegisterIframeEventListener, getListener } = makeRegisterListener();

				renderWithContext(
					<UFOThirdPartySegment
						name="test-segment"
						onRegisterIframeEventListener={onRegisterIframeEventListener}
						extraData={{ appType: 'CustomUI' }}
					>
						<div>Test content</div>
					</UFOThirdPartySegment>,
				);

				act(() => {
					getListener()({ type: 'resized', height: 240 } as any);
				});

				expect(mockAddIframeSegmentData).not.toHaveBeenCalledWith(
					expect.anything(),
					expect.anything(),
					expect.objectContaining({ label: 'resized' }),
				);
			});
		});
	});
});
