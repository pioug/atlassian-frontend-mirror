import { unstable_scheduleCallback as scheduleCallback } from 'scheduler';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import scheduleIdleCallback from './schedule-idle-callback';

const GATE = 'platform_ufo_native_task_scheduling';

jest.mock('scheduler', () => ({
	unstable_IdlePriority: 'idlePriority',
	unstable_scheduleCallback: jest.fn(),
}));

describe('scheduleIdleCallback', () => {
	const originalRequestIdleCallback = window.requestIdleCallback;
	let originalScheduler: unknown;

	beforeEach(() => {
		originalScheduler = (globalThis as any).scheduler;
		jest.useFakeTimers();
	});

	afterEach(() => {
		window.requestIdleCallback = originalRequestIdleCallback;
		(globalThis as any).scheduler = originalScheduler;
		jest.useRealTimers();
		jest.clearAllMocks();
	});

	describe('when platform_ufo_native_task_scheduling is disabled', () => {
		beforeEach(() => {
			failGate(GATE);
		});

		it('uses the scheduler package at idle priority, even if requestIdleCallback is available', () => {
			const work = jest.fn();
			window.requestIdleCallback = jest.fn();

			scheduleIdleCallback(work);

			expect(scheduleCallback).toHaveBeenCalledWith('idlePriority', work);
			expect(window.requestIdleCallback).not.toHaveBeenCalled();
		});
	});

	describe('when platform_ufo_native_task_scheduling is enabled', () => {
		beforeEach(() => {
			passGate(GATE);
		});

		it('uses requestIdleCallback when available', () => {
			const work = jest.fn();
			const postTask = jest.fn(() => Promise.resolve());
			window.requestIdleCallback = jest.fn();
			(globalThis as any).scheduler = { postTask };

			scheduleIdleCallback(work);

			expect(window.requestIdleCallback).toHaveBeenCalledWith(work);
			expect(postTask).not.toHaveBeenCalled();
			expect(scheduleCallback).not.toHaveBeenCalled();
		});

		it('falls back to scheduler.postTask with background priority when requestIdleCallback is unavailable', () => {
			const work = jest.fn();
			const postTask = jest.fn(() => Promise.resolve());
			// @ts-ignore - simulate browsers without requestIdleCallback (e.g. Safari)
			window.requestIdleCallback = undefined;
			(globalThis as any).scheduler = { postTask };

			scheduleIdleCallback(work);

			expect(postTask).toHaveBeenCalledWith(work, { priority: 'background' });
			expect(scheduleCallback).not.toHaveBeenCalled();
		});

		it('falls back to setTimeout when neither requestIdleCallback nor scheduler.postTask is available', () => {
			const work = jest.fn();
			// @ts-ignore - simulate browsers without requestIdleCallback (e.g. Safari)
			window.requestIdleCallback = undefined;
			(globalThis as any).scheduler = undefined;

			scheduleIdleCallback(work);

			expect(work).not.toHaveBeenCalled();
			jest.runAllTimers();
			expect(work).toHaveBeenCalledTimes(1);
			expect(scheduleCallback).not.toHaveBeenCalled();
		});
	});
});
