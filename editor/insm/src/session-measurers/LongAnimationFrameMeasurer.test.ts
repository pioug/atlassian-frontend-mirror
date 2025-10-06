/* eslint-disable @typescript-eslint/no-explicit-any */
import type { INSMSession } from '../insm-session';
import {
	LongAnimationFrameMeasurer,
	type _PerformanceScriptTiming,
} from './LongAnimationFrameMeasurer';

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

// Helper to create mock script timing entries
const createMockScript = (overrides: Partial<_PerformanceScriptTiming> = {}) => {
	return {
		duration: overrides.duration || 50,
		entryType: 'script',
		invoker: overrides.invoker || 'DIV#example-id.onclick',
		invokerType: overrides.invokerType || 'event-listener',
		name: overrides.name || 'script',
		sourceCharPosition: overrides.sourceCharPosition || 10,
		sourceFunctionName: overrides.sourceFunctionName || 'handleClick',
		sourceURL: overrides.sourceURL || 'https://example.com/script.js',
		forcedStyleAndLayoutDuration: overrides.forcedStyleAndLayoutDuration || 5,
		startTime: overrides.startTime || 0,
		executionStart: overrides.executionStart || 0,
		pauseDuration: overrides.pauseDuration || 0,
		windowAttribution: overrides.windowAttribution || 'self',
	} as _PerformanceScriptTiming;
};

// Helper to create mock long animation frame entries with scripts
const createMockFrame = (
	frameDuration: number,
	scripts: _PerformanceScriptTiming[] = [],
	startTime: number = 0,
): any => {
	return {
		entryType: 'long-animation-frame',
		name: 'long-animation-frame',
		startTime,
		duration: frameDuration,
		renderStart: startTime + 1,
		styleAndLayoutStart: startTime + 2,
		blockingDuration: frameDuration * 0.8,
		firstUIEventTimestamp: startTime + 0.5,
		scripts: scripts,
	};
};

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

describe('LongAnimationFrameMeasurer - Script Tracker', () => {
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

	describe('Heavy Task Impact on Script Collection', () => {
		test('scripts are ignored when heavy tasks are running at start', () => {
			const insmSession = createMockINSMSession(['heavy-task-1'], ['feature-a']);

			const measurer = new LongAnimationFrameMeasurer({
				initial: false,
				limit: 5,
				insmSession,
				reportingThreshold: 50,
			});

			const script = createMockScript({ duration: 80 });
			const frame = createMockFrame(100, [script]);
			triggerPerformanceEntries([frame]);

			// No scripts should be collected
			expect(measurer.current).toEqual([]);
		});

		test('scripts are collected when no heavy tasks at start', () => {
			const insmSession = createMockINSMSession([], ['feature-a']);

			const measurer = new LongAnimationFrameMeasurer({
				initial: false,
				limit: 5,
				insmSession,
				reportingThreshold: 50,
			});

			const script = createMockScript({ duration: 80 });
			const frame = createMockFrame(100, [script]);
			triggerPerformanceEntries([frame]);

			const results = measurer.current;
			expect(results).toHaveLength(1);
			expect(results[0].duration).toBe(80);
		});

		test('scripts are collected when heavy tasks at start, but then tracking is resumed', () => {
			const insmSession = createMockINSMSession(['heavy-task-1'], ['feature-a']);

			const measurer = new LongAnimationFrameMeasurer({
				initial: false,
				limit: 5,
				insmSession,
				reportingThreshold: 50,
			});

			const script = createMockScript({ duration: 80 });
			const frame = createMockFrame(100, [script]);

			// Initially no frames should be collected due to heavy tasks
			triggerPerformanceEntries([frame]);
			expect(measurer.current).toHaveLength(0);

			// Resume tracking
			measurer.resume();

			triggerPerformanceEntries([
				createMockFrame(100, [createMockScript({ duration: 120 })]),
				createMockFrame(100, [createMockScript({ duration: 80 })]),
			]);

			const results = measurer.current;
			expect(results).toHaveLength(2);
			expect(results[0].duration).toBe(120);
			expect(results[1].duration).toBe(80);
		});
	});

	describe('Frame Filtering by Reporting Threshold', () => {
		test('ignores frames below reporting threshold completely', () => {
			const insmSession = createMockINSMSession([], ['feature-a']);

			const measurer = new LongAnimationFrameMeasurer({
				initial: false,
				limit: 5,
				insmSession,
				reportingThreshold: 100,
			});

			// Create scripts in frames below threshold
			const scriptInShortFrame = createMockScript({ duration: 50 });
			const shortFrame = createMockFrame(50, [scriptInShortFrame]);

			const scriptInLongFrame = createMockScript({ duration: 80 });
			const longFrame = createMockFrame(150, [scriptInLongFrame]);

			triggerPerformanceEntries([shortFrame, longFrame]);

			const results = measurer.current;
			// Only script from the long frame should be tracked
			expect(results).toHaveLength(1);
			expect(results[0].duration).toBe(80);
		});

		test('processes all scripts from frames meeting threshold', () => {
			const insmSession = createMockINSMSession([], ['feature-a']);

			const measurer = new LongAnimationFrameMeasurer({
				initial: false,
				limit: 5,
				insmSession,
				reportingThreshold: 100,
			});

			// Create multiple scripts in a frame that meets threshold
			const script1 = createMockScript({ duration: 30, sourceURL: 'script1.js' });
			const script2 = createMockScript({ duration: 50, sourceURL: 'script2.js' });
			const script3 = createMockScript({ duration: 20, sourceURL: 'script3.js' });
			const longFrame = createMockFrame(120, [script1, script2, script3]);

			triggerPerformanceEntries([longFrame]);

			const results = measurer.current;
			expect(results).toHaveLength(3);
			// Should be sorted by duration (longest first)
			expect(results[0].duration).toBe(50);
			expect(results[0].sourceURL).toBe('script2.js');
			expect(results[1].duration).toBe(30);
			expect(results[1].sourceURL).toBe('script1.js');
			expect(results[2].duration).toBe(20);
			expect(results[2].sourceURL).toBe('script3.js');
		});
	});

	describe('Script Timing Data Capture', () => {
		test('captures all required script timing fields', () => {
			const insmSession = createMockINSMSession([], ['feature-a', 'feature-b']);

			const measurer = new LongAnimationFrameMeasurer({
				initial: false,
				limit: 5,
				insmSession,
				reportingThreshold: 50,
			});

			const script = createMockScript({
				duration: 75,
				forcedStyleAndLayoutDuration: 15,
				invoker: 'button.addEventListener',
				invokerType: 'event-listener',
				sourceCharPosition: 42,
				sourceFunctionName: 'handleSubmit',
				sourceURL: 'https://example.com/app.js',
			});

			const frame = createMockFrame(100, [script]);
			triggerPerformanceEntries([frame]);

			const results = measurer.current;
			expect(results).toHaveLength(1);

			const result = results[0];
			expect(result.duration).toBe(75);
			expect(result.forcedStyleAndLayoutDuration).toBe(15);
			expect(result.invoker).toBe('button.addEventListener');
			expect(result.invokerType).toBe('event-listener');
			expect(result.sourceCharPosition).toBe(42);
			expect(result.sourceFunctionName).toBe('handleSubmit');
			expect(result.sourceURL).toBe('https://example.com/app.js');
			expect(result.features).toEqual(['feature-a', 'feature-b']);
			expect(result.afDuration).toEqual(100);
		});

		test('captures running features context with each script', () => {
			const insmSession = createMockINSMSession([], ['analytics', 'ui-refresh']);

			const measurer = new LongAnimationFrameMeasurer({
				initial: false,
				limit: 5,
				insmSession,
				reportingThreshold: 50,
			});

			const script1 = createMockScript({ duration: 60, sourceURL: 'script1.js' });
			const script2 = createMockScript({ duration: 40, sourceURL: 'script2.js' });
			const frame = createMockFrame(100, [script1, script2]);

			triggerPerformanceEntries([frame]);

			const results = measurer.current;
			expect(results).toHaveLength(2);

			// Both scripts should have the same running features
			expect((results[0] as any).features).toEqual(['analytics', 'ui-refresh']);
			expect((results[1] as any).features).toEqual(['analytics', 'ui-refresh']);
		});
	});

	describe('Pause/Resume Script Collection', () => {
		test('pause() stops collecting new scripts', () => {
			const insmSession = createMockINSMSession([], ['feature-a']);

			const measurer = new LongAnimationFrameMeasurer({
				initial: false,
				limit: 5,
				insmSession,
				reportingThreshold: 50,
			});

			// Collect some scripts initially
			const script1 = createMockScript({ duration: 60 });
			const frame1 = createMockFrame(100, [script1]);
			triggerPerformanceEntries([frame1]);
			expect(measurer.current).toHaveLength(1);

			// Pause and try to collect more scripts
			measurer.pause();
			const script2 = createMockScript({ duration: 80 });
			const frame2 = createMockFrame(120, [script2]);
			triggerPerformanceEntries([frame2]);

			// Should still only have the original script
			expect(measurer.current).toHaveLength(1);
			expect(measurer.current[0].duration).toBe(60);
		});

		test('resume() allows script collection to continue', () => {
			const insmSession = createMockINSMSession([], ['feature-a']);

			const measurer = new LongAnimationFrameMeasurer({
				initial: false,
				limit: 5,
				insmSession,
				reportingThreshold: 50,
			});

			// Pause immediately
			measurer.pause();
			const script1 = createMockScript({ duration: 60 });
			const frame1 = createMockFrame(100, [script1]);
			triggerPerformanceEntries([frame1]);
			expect(measurer.current).toHaveLength(0);

			// Resume and collect scripts
			measurer.resume();
			const script2 = createMockScript({ duration: 80 });
			const frame2 = createMockFrame(120, [script2]);
			triggerPerformanceEntries([frame2]);

			expect(measurer.current).toHaveLength(1);
			expect(measurer.current[0].duration).toBe(80);
		});
	});

	describe('Longest Scripts Tracking', () => {
		test('maintains collection up to specified limit', () => {
			const insmSession = createMockINSMSession([], ['feature-a']);

			const measurer = new LongAnimationFrameMeasurer({
				initial: false,
				limit: 3,
				insmSession,
				reportingThreshold: 20,
			});

			// Add scripts up to limit
			const scripts = [
				createMockScript({ duration: 60, sourceURL: 'script1.js' }),
				createMockScript({ duration: 80, sourceURL: 'script2.js' }),
				createMockScript({ duration: 70, sourceURL: 'script3.js' }),
			];

			// Send each script in its own frame
			scripts.forEach((script) => {
				const frame = createMockFrame(100, [script]);
				triggerPerformanceEntries([frame]);
			});

			expect(measurer.current).toHaveLength(3);

			// Add more scripts beyond limit
			const moreScripts = [
				createMockScript({ duration: 40, sourceURL: 'script4.js' }),
				createMockScript({ duration: 50, sourceURL: 'script5.js' }),
			];

			moreScripts.forEach((script) => {
				const frame = createMockFrame(100, [script]);
				triggerPerformanceEntries([frame]);
			});

			// Should still be at limit
			expect(measurer.current).toHaveLength(3);
		});

		test('keeps only the longest scripts when limit exceeded', () => {
			const insmSession = createMockINSMSession([], ['feature-a']);

			const measurer = new LongAnimationFrameMeasurer({
				initial: false,
				limit: 3,
				insmSession,
				reportingThreshold: 50,
			});

			// Add initial scripts
			const initialScripts = [
				createMockScript({ duration: 60, sourceURL: 'script1.js' }),
				createMockScript({ duration: 80, sourceURL: 'script2.js' }),
				createMockScript({ duration: 70, sourceURL: 'script3.js' }),
			];

			initialScripts.forEach((script) => {
				const frame = createMockFrame(100, [script]);
				triggerPerformanceEntries([frame]);
			});

			// Add longer scripts that should replace shorter ones
			const longerScripts = [
				createMockScript({ duration: 90, sourceURL: 'script4.js' }),
				createMockScript({ duration: 85, sourceURL: 'script5.js' }),
			];

			longerScripts.forEach((script) => {
				const frame = createMockFrame(150, [script]);
				triggerPerformanceEntries([frame]);
			});

			const results = measurer.current;
			expect(results).toHaveLength(3);
			expect(results[0].duration).toBe(90);
			expect(results[0].sourceURL).toBe('script4.js');
			expect(results[1].duration).toBe(85);
			expect(results[1].sourceURL).toBe('script5.js');
			expect(results[2].duration).toBe(80);
			expect(results[2].sourceURL).toBe('script2.js');
		});

		test('returns scripts sorted by duration (longest first)', () => {
			const insmSession = createMockINSMSession([], ['feature-a']);

			const measurer = new LongAnimationFrameMeasurer({
				initial: false,
				limit: 5,
				insmSession,
				reportingThreshold: 50,
			});

			// Add scripts in random order
			const scripts = [
				createMockScript({ duration: 65, sourceURL: 'script1.js' }),
				createMockScript({ duration: 95, sourceURL: 'script2.js' }),
				createMockScript({ duration: 55, sourceURL: 'script3.js' }),
				createMockScript({ duration: 85, sourceURL: 'script4.js' }),
			];

			scripts.forEach((script) => {
				const frame = createMockFrame(100, [script]);
				triggerPerformanceEntries([frame]);
			});

			const results = measurer.current;
			expect(results).toHaveLength(4);
			expect(results[0].duration).toBe(95);
			expect(results[0].sourceURL).toBe('script2.js');
			expect(results[1].duration).toBe(85);
			expect(results[1].sourceURL).toBe('script4.js');
			expect(results[2].duration).toBe(65);
			expect(results[2].sourceURL).toBe('script1.js');
			expect(results[3].duration).toBe(55);
			expect(results[3].sourceURL).toBe('script3.js');
		});
	});

	describe('Edge Cases', () => {
		test('handles frames with no scripts', () => {
			const insmSession = createMockINSMSession([], ['feature-a']);

			const measurer = new LongAnimationFrameMeasurer({
				initial: false,
				limit: 5,
				insmSession,
				reportingThreshold: 50,
			});

			// Frame with no scripts
			const frameWithNoScripts = createMockFrame(100, []);
			triggerPerformanceEntries([frameWithNoScripts]);

			expect(measurer.current).toEqual([]);
		});

		test('handles frames with empty scripts array', () => {
			const insmSession = createMockINSMSession([], ['feature-a']);

			const measurer = new LongAnimationFrameMeasurer({
				initial: false,
				limit: 5,
				insmSession,
				reportingThreshold: 50,
			});

			// Create a frame with undefined scripts
			const frameWithUndefinedScripts = {
				entryType: 'long-animation-frame',
				name: 'long-animation-frame',
				startTime: 0,
				duration: 100,
				renderStart: 1,
				styleAndLayoutStart: 2,
				blockingDuration: 80,
				firstUIEventTimestamp: 0.5,
				scripts: undefined,
			};

			triggerPerformanceEntries([frameWithUndefinedScripts]);

			expect(measurer.current).toEqual([]);
		});

		test('empty results when no qualifying scripts collected', () => {
			const insmSession = createMockINSMSession([], ['feature-a']);

			const measurer = new LongAnimationFrameMeasurer({
				initial: false,
				limit: 5,
				insmSession,
				reportingThreshold: 100,
			});

			// Trigger frames below threshold (so scripts won't be processed)
			const script = createMockScript({ duration: 50 });
			const frame = createMockFrame(50, [script]);
			triggerPerformanceEntries([frame]);

			expect(measurer.current).toEqual([]);
		});
	});

	describe('Cleanup and Resource Management', () => {
		test('cleanup stops all script collection', () => {
			const insmSession = createMockINSMSession([], ['feature-a']);

			const measurer = new LongAnimationFrameMeasurer({
				initial: false,
				limit: 5,
				insmSession,
				reportingThreshold: 50,
			});

			// Collect some scripts initially
			const script1 = createMockScript({ duration: 60 });
			const frame1 = createMockFrame(100, [script1]);
			triggerPerformanceEntries([frame1]);
			expect(measurer.current).toHaveLength(1);

			// Cleanup
			measurer.cleanup();
			expect(mockDisconnect).toHaveBeenCalled();

			// Try to collect more scripts after cleanup
			const script2 = createMockScript({ duration: 80 });
			const frame2 = createMockFrame(120, [script2]);
			triggerPerformanceEntries([frame2]);

			// Should still only have the original script
			expect(measurer.current).toHaveLength(1);
			expect(measurer.current[0].duration).toBe(60);
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
