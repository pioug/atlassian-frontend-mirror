/**
 * @jest-environment node
 */

import { defaultExposureEnvironment, type PageLifecycleListener } from '../exposure/environment';
import { stubGlobal, unstubAllGlobals } from './_utils/stub-globals';

afterEach(() => {
	jest.useRealTimers();
	unstubAllGlobals();
});

function stubPage(visibilityState: DocumentVisibilityState) {
	const document = Object.assign(new EventTarget(), { visibilityState });
	const window = new EventTarget();
	stubGlobal('document', document);
	stubGlobal('window', window);
	return { document, window };
}

function recordingListener(): { events: string[]; listener: PageLifecycleListener } {
	const events: string[] = [];
	return {
		events,
		listener: { hidden: () => events.push('hidden'), visible: () => events.push('visible') },
	};
}

describe('defaultExposureEnvironment storage', () => {
	it('returns the page localStorage', () => {
		const localStorage = { length: 0 };
		stubGlobal('window', { localStorage });

		expect(defaultExposureEnvironment().storage()).toBe(localStorage);
	});

	it('returns null when reading localStorage throws a SecurityError', () => {
		stubGlobal('window', {
			get localStorage(): never {
				throw new DOMException('The operation is insecure.', 'SecurityError');
			},
		});

		expect(defaultExposureEnvironment().storage()).toBeNull();
	});

	it('returns null outside a browser page', () => {
		expect(defaultExposureEnvironment().storage()).toBeNull();
	});
});

describe('defaultExposureEnvironment page lifecycle', () => {
	it('maps visibilitychange to hidden and visible, and pagehide to hidden', () => {
		const { document, window } = stubPage('visible');
		const { events, listener } = recordingListener();

		defaultExposureEnvironment().onPageLifecycle(listener);
		expect(events).toEqual([]);
		document.visibilityState = 'hidden';
		document.dispatchEvent(new Event('visibilitychange'));
		document.visibilityState = 'visible';
		document.dispatchEvent(new Event('visibilitychange'));
		window.dispatchEvent(new Event('pagehide'));

		expect(events).toEqual(['hidden', 'visible', 'hidden']);
	});

	it.each([
		['a visible page restored from the back/forward cache', true, 'visible', ['visible']],
		['a first load', false, 'visible', []],
		['a page restored hidden', true, 'hidden', []],
	] as const)('maps pageshow for %s', (_name, persisted, visibilityState, expected) => {
		const { document, window } = stubPage('visible');
		const { events, listener } = recordingListener();

		defaultExposureEnvironment().onPageLifecycle(listener);
		document.visibilityState = visibilityState;
		window.dispatchEvent(Object.assign(new Event('pageshow'), { persisted }));

		expect(events).toEqual(expected);
	});

	it('reports hidden at registration when the page is already hidden', () => {
		stubPage('hidden');
		const { events, listener } = recordingListener();

		defaultExposureEnvironment().onPageLifecycle(listener);

		expect(events).toEqual(['hidden']);
	});

	it('does nothing outside a browser page', () => {
		const { events, listener } = recordingListener();

		defaultExposureEnvironment().onPageLifecycle(listener);

		expect(events).toEqual([]);
	});
});

describe('defaultExposureEnvironment microtasks', () => {
	it('runs a queued callback after the current synchronous work', async () => {
		const order: string[] = [];
		defaultExposureEnvironment().queueMicrotask(() => order.push('microtask'));
		order.push('sync');
		await Promise.resolve();

		expect(order).toEqual(['sync', 'microtask']);
	});
});

describe('defaultExposureEnvironment abort controllers', () => {
	it('creates a new AbortController for each request', () => {
		const environment = defaultExposureEnvironment();
		const first = environment.abortController();

		expect(first).toBeInstanceOf(AbortController);
		expect(environment.abortController()).not.toBe(first);
	});

	it('returns undefined when the host has no AbortController', () => {
		stubGlobal('AbortController', undefined);

		expect(defaultExposureEnvironment().abortController()).toBeUndefined();
	});
});

describe('defaultExposureEnvironment timers', () => {
	it('does not keep the process alive for a pending timer', () => {
		const environment = defaultExposureEnvironment();

		const timer = environment.setTimeout(() => undefined, 60_000) as ReturnType<typeof setTimeout>;

		expect(timer.hasRef()).toBe(false);
		environment.clearTimeout(timer);
	});

	it('fires a timer once its delay elapses', () => {
		jest.useFakeTimers();
		const environment = defaultExposureEnvironment();
		const callback = jest.fn();

		environment.setTimeout(callback, 1_000);
		jest.advanceTimersByTime(999);
		expect(callback).not.toHaveBeenCalled();
		jest.advanceTimersByTime(1);

		expect(callback).toHaveBeenCalledTimes(1);
	});

	it('cancels a pending timer', () => {
		jest.useFakeTimers();
		const environment = defaultExposureEnvironment();
		const callback = jest.fn();

		const timer = environment.setTimeout(callback, 1_000);
		environment.clearTimeout(timer);
		jest.advanceTimersByTime(1_000);

		expect(callback).not.toHaveBeenCalled();
	});

	it.each([undefined, null])('ignores %s as a handle, as the host does', (handle) => {
		const environment = defaultExposureEnvironment();

		expect(() => environment.clearTimeout(handle)).not.toThrow();
	});
});
