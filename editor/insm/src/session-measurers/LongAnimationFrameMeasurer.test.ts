/* eslint-disable @typescript-eslint/no-explicit-any */
import type { INSMSession } from '../insm-session';
import { LongAnimationFrameMeasurer } from './LongAnimationFrameMeasurer';

// Mock PerformanceObserver
const mockObserve = jest.fn();
const mockDisconnect = jest.fn();
let observerCallback: ((list: any) => void) | null = null;
let isObserverDisconnected = false;

const mockPerformanceObserver = jest.fn().mockImplementation((callback) => ({
	observe: mockObserve,
	disconnect: jest.fn(() => {
		mockDisconnect();
		isObserverDisconnected = true;
	}),
	callback,
}));

// Helper to create mock long animation frame entries
const createMockFrame = (duration: number, startTime: number = 0): any => ({
	entryType: 'long-animation-frame',
	name: 'long-animation-frame',
	startTime,
	duration,
	renderStart: startTime + 1,
	styleAndLayoutStart: startTime + 2,
	blockingDuration: duration * 0.8,
	firstUIEventTimestamp: startTime + 0.5,
	scripts: [],
});

// Helper to create mock INSMSession
const createMockINSMSession = (heavyTasks: string[] = [], runningFeatures: string[] = []) =>
	({
		insm: {
			runningHeavyTasks: new Set(heavyTasks),
		},
		runningFeatures: new Set(runningFeatures),
	}) as INSMSession;

// Helper to trigger performance observer with entries
const triggerPerformanceEntries = (entries: any[]) => {
	if (observerCallback && !isObserverDisconnected) {
		observerCallback({
			getEntries: () => entries,
		});
	}
};

describe('LongAnimationFrameMeasurer', () => {
	let originalPerformanceObserver: typeof PerformanceObserver;

	beforeEach(() => {
		jest.clearAllMocks();
		observerCallback = null;
		isObserverDisconnected = false;

		// Store original PerformanceObserver
		originalPerformanceObserver = window.PerformanceObserver;

		global.PerformanceObserver = mockPerformanceObserver as any;
		(global.PerformanceObserver as any).supportedEntryTypes = ['long-animation-frame'];

		// Capture the callback when PerformanceObserver is created
		mockPerformanceObserver.mockImplementation((callback) => {
			observerCallback = callback;
			return {
				observe: mockObserve,
				disconnect: jest.fn(() => {
					mockDisconnect();
					isObserverDisconnected = true;
				}),
				callback,
			};
		});
	});

	afterEach(() => {
		// Restore original PerformanceObserver
		window.PerformanceObserver = originalPerformanceObserver;
	});

	describe('Heavy Task Impact on Frame Collection', () => {
		test('frames are ignored when heavy tasks are running at start', () => {
			const insmSession = createMockINSMSession(['heavy-task-1'], ['feature-a']);

			const measurer = new LongAnimationFrameMeasurer({
				initial: false,
				limit: 5,
				insmSession,
				reportingThreshold: 50,
			});

			// Trigger some frames while heavy tasks are running
			triggerPerformanceEntries([createMockFrame(100), createMockFrame(150)]);

			// No frames should be collected
			expect(measurer.current).toEqual([]);
		});

		test('frames are collected when no heavy tasks at start', () => {
			const insmSession = createMockINSMSession([], ['feature-a']);

			const measurer = new LongAnimationFrameMeasurer({
				initial: false,
				limit: 5,
				insmSession,
				reportingThreshold: 50,
			});

			// Trigger frames when no heavy tasks are running
			triggerPerformanceEntries([createMockFrame(100), createMockFrame(150)]);

			// Frames should be collected
			const results = measurer.current;
			expect(results).toHaveLength(2);
			expect(results[0].duration).toBe(150); // Sorted longest first
			expect(results[1].duration).toBe(100);
		});

		test('frames are collected when heavy tasks at start, but then tracking is resumed', () => {
			const insmSession = createMockINSMSession(['heavy-task-1'], ['feature-a']);

			const measurer = new LongAnimationFrameMeasurer({
				initial: false,
				limit: 5,
				insmSession,
				reportingThreshold: 50,
			});

			// Initially no frames should be collected due to heavy tasks
			triggerPerformanceEntries([createMockFrame(100)]);
			expect(measurer.current).toEqual([]);

			// Resume tracking
			measurer.resume();

			// Now frames should be collected
			triggerPerformanceEntries([createMockFrame(120), createMockFrame(80)]);

			const results = measurer.current;
			expect(results).toHaveLength(2);
			expect(results[0].duration).toBe(120);
			expect(results[1].duration).toBe(80);
		});
	});

	describe('Frame Collection Behavior', () => {
		test('ignores frames below reporting threshold', () => {
			const insmSession = createMockINSMSession([], ['feature-a']);

			const measurer = new LongAnimationFrameMeasurer({
				initial: false,
				limit: 5,
				insmSession,
				reportingThreshold: 100,
			});

			// Trigger frames below and above threshold
			triggerPerformanceEntries([
				createMockFrame(50), // Below threshold
				createMockFrame(99), // Below threshold
				createMockFrame(100), // At threshold
				createMockFrame(150), // Above threshold
			]);

			const results = measurer.current;
			expect(results).toHaveLength(2);
			expect(results[0].duration).toBe(150);
			expect(results[1].duration).toBe(100);
		});

		test('collects frames meeting reporting threshold', () => {
			const insmSession = createMockINSMSession([], ['feature-a']);

			const measurer = new LongAnimationFrameMeasurer({
				initial: false,
				limit: 5,
				insmSession,
				reportingThreshold: 75,
			});

			triggerPerformanceEntries([
				createMockFrame(75), // Exactly at threshold
				createMockFrame(100), // Above threshold
			]);

			const results = measurer.current;
			expect(results).toHaveLength(2);
			expect(results[0].duration).toBe(100);
			expect(results[1].duration).toBe(75);
		});

		test('captures feature context with collected frames', () => {
			const insmSession = createMockINSMSession([], ['feature-a', 'feature-b']);

			const measurer = new LongAnimationFrameMeasurer({
				initial: false,
				limit: 5,
				insmSession,
				reportingThreshold: 50,
			});

			triggerPerformanceEntries([createMockFrame(100)]);

			const results = measurer.current;
			expect(results).toHaveLength(1);
			expect((results[0] as any).runningFeatures).toEqual(['feature-a', 'feature-b']);
		});
	});

	describe('Pause/Resume Frame Collection', () => {
		test('pause() stops collecting new frames', () => {
			const insmSession = createMockINSMSession([], ['feature-a']);

			const measurer = new LongAnimationFrameMeasurer({
				initial: false,
				limit: 5,
				insmSession,
				reportingThreshold: 50,
			});

			// Collect some frames initially
			triggerPerformanceEntries([createMockFrame(100)]);
			expect(measurer.current).toHaveLength(1);

			// Pause and try to collect more frames
			measurer.pause();
			triggerPerformanceEntries([createMockFrame(150)]);

			// Should still only have the original frame
			expect(measurer.current).toHaveLength(1);
			expect(measurer.current[0].duration).toBe(100);
		});

		test('resume() allows frame collection to continue', () => {
			const insmSession = createMockINSMSession([], ['feature-a']);

			const measurer = new LongAnimationFrameMeasurer({
				initial: false,
				limit: 5,
				insmSession,
				reportingThreshold: 50,
			});

			// Pause immediately
			measurer.pause();
			triggerPerformanceEntries([createMockFrame(100)]);
			expect(measurer.current).toHaveLength(0);

			// Resume and collect frames
			measurer.resume();
			triggerPerformanceEntries([createMockFrame(150)]);

			expect(measurer.current).toHaveLength(1);
			expect(measurer.current[0].duration).toBe(150);
		});

		test('frames during paused period are lost', () => {
			const insmSession = createMockINSMSession([], ['feature-a']);

			const measurer = new LongAnimationFrameMeasurer({
				initial: false,
				limit: 5,
				insmSession,
				reportingThreshold: 50,
			});

			// Collect initial frame
			triggerPerformanceEntries([createMockFrame(100)]);
			expect(measurer.current).toHaveLength(1);

			// Pause and trigger frames (these should be lost)
			measurer.pause();
			triggerPerformanceEntries([createMockFrame(200), createMockFrame(300)]);

			// Resume and trigger new frames
			measurer.resume();
			triggerPerformanceEntries([createMockFrame(150)]);

			// Should only have initial frame and post-resume frame
			const results = measurer.current;
			expect(results).toHaveLength(2);
			expect(results[0].duration).toBe(150);
			expect(results[1].duration).toBe(100);
		});
	});

	describe('Longest Frames Tracking', () => {
		test('maintains collection up to specified limit', () => {
			const insmSession = createMockINSMSession([], ['feature-a']);

			const measurer = new LongAnimationFrameMeasurer({
				initial: false,
				limit: 3,
				insmSession,
				reportingThreshold: 50,
			});

			// Add frames up to limit
			triggerPerformanceEntries([createMockFrame(100), createMockFrame(150), createMockFrame(120)]);

			expect(measurer.current).toHaveLength(3);

			// Add more frames beyond limit
			triggerPerformanceEntries([createMockFrame(80), createMockFrame(90)]);

			// Should still be at limit
			expect(measurer.current).toHaveLength(3);
		});

		test('keeps only the longest frames when limit exceeded', () => {
			const insmSession = createMockINSMSession([], ['feature-a']);

			const measurer = new LongAnimationFrameMeasurer({
				initial: false,
				limit: 3,
				insmSession,
				reportingThreshold: 50,
			});

			// Add initial frames
			triggerPerformanceEntries([createMockFrame(100), createMockFrame(150), createMockFrame(120)]);

			// Add longer frames that should replace shorter ones
			triggerPerformanceEntries([createMockFrame(200), createMockFrame(180)]);

			const results = measurer.current;
			expect(results).toHaveLength(3);
			expect(results[0].duration).toBe(200);
			expect(results[1].duration).toBe(180);
			expect(results[2].duration).toBe(150);
		});

		test('returns frames sorted by duration (longest first)', () => {
			const insmSession = createMockINSMSession([], ['feature-a']);

			const measurer = new LongAnimationFrameMeasurer({
				initial: false,
				limit: 5,
				insmSession,
				reportingThreshold: 50,
			});

			// Add frames in random order
			triggerPerformanceEntries([
				createMockFrame(120),
				createMockFrame(200),
				createMockFrame(80),
				createMockFrame(150),
			]);

			const results = measurer.current;
			expect(results).toHaveLength(4);
			expect(results[0].duration).toBe(200);
			expect(results[1].duration).toBe(150);
			expect(results[2].duration).toBe(120);
			expect(results[3].duration).toBe(80);
		});
	});

	describe('Results Retrieval', () => {
		test('empty results when no qualifying frames collected', () => {
			const insmSession = createMockINSMSession([], ['feature-a']);

			const measurer = new LongAnimationFrameMeasurer({
				initial: false,
				limit: 5,
				insmSession,
				reportingThreshold: 100,
			});

			// Trigger frames below threshold
			triggerPerformanceEntries([createMockFrame(50), createMockFrame(75)]);

			expect(measurer.current).toEqual([]);
		});
	});

	describe('Cleanup and Resource Management', () => {
		test('cleanup stops all frame collection', () => {
			const insmSession = createMockINSMSession([], ['feature-a']);

			const measurer = new LongAnimationFrameMeasurer({
				initial: false,
				limit: 5,
				insmSession,
				reportingThreshold: 50,
			});

			// Collect some frames initially
			triggerPerformanceEntries([createMockFrame(100)]);
			expect(measurer.current).toHaveLength(1);

			// Cleanup
			measurer.cleanup();
			expect(mockDisconnect).toHaveBeenCalled();

			// Try to collect more frames after cleanup
			triggerPerformanceEntries([createMockFrame(150)]);

			// Should still only have the original frame
			expect(measurer.current).toHaveLength(1);
			expect(measurer.current[0].duration).toBe(100);
		});
	});

	describe('PerformanceObserver Integration', () => {
		test('sets up observer with correct options when supported', () => {
			const insmSession = createMockINSMSession([], []);

			// oxlint-disable-next-line no-new
			new LongAnimationFrameMeasurer({
				initial: true,
				limit: 5,
				insmSession,
				reportingThreshold: 50,
			});

			expect(mockPerformanceObserver).toHaveBeenCalledWith(expect.any(Function));
			expect(mockObserve).toHaveBeenCalledWith({
				type: 'long-animation-frame',
				buffered: true,
			});
		});

		test('handles unsupported entry types gracefully', () => {
			// Temporarily remove support
			const originalSupportedTypes = (global.PerformanceObserver as any).supportedEntryTypes;
			(global.PerformanceObserver as any).supportedEntryTypes = [];

			const insmSession = createMockINSMSession([], []);

			const measurer = new LongAnimationFrameMeasurer({
				initial: false,
				limit: 5,
				insmSession,
				reportingThreshold: 50,
			});

			expect(mockPerformanceObserver).not.toHaveBeenCalled();
			expect(measurer.current).toEqual([]);

			// Restore original supported types
			(global.PerformanceObserver as any).supportedEntryTypes = originalSupportedTypes;
		});
	});
});
