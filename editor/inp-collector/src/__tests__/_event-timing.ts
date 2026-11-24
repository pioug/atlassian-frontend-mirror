/**
 * A fake Event Timing implementation for tests: jsdom has none, and the collector only
 * runs when `interactionId` and `performance.interactionCount` are both present.
 *
 * Named with a leading underscore so the jest runner does not treat it as a test suite.
 */

export type FakeEntry = {
	duration: number;
	entryType: 'event';
	interactionId: number;
	name: string;
	startTime: number;
	toJSON: () => unknown;
};

/**
 * Stands in for the browser's Event Timing observer. `deliver` mimics the callback, `queue`
 * mimics entries the browser has produced but not dispatched yet — the ones a lifecycle
 * snapshot has to drain through `takeRecords`.
 */
export class FakePerformanceObserver {
	static supportedEntryTypes: string[] = ['event'];
	static instances: FakePerformanceObserver[] = [];

	disconnected = false;
	observedWith: PerformanceObserverInit | undefined;
	private buffered: FakeEntry[] = [];

	constructor(private readonly callback: (list: { getEntries: () => FakeEntry[] }) => void) {
		FakePerformanceObserver.instances.push(this);
	}

	observe(init: PerformanceObserverInit): void {
		this.observedWith = init;
	}

	takeRecords(): FakeEntry[] {
		const entries = this.buffered;
		this.buffered = [];
		return entries;
	}

	disconnect(): void {
		this.disconnected = true;
	}

	deliver(entries: FakeEntry[]): void {
		this.callback({ getEntries: () => entries });
	}

	queue(entries: FakeEntry[]): void {
		this.buffered.push(...entries);
	}
}

/** `overrides` say which event the entry measured: its type as `name`, its timestamp as `startTime`. */
export const entry = (
	interactionId: number,
	duration: number,
	overrides: Partial<FakeEntry> = {},
): FakeEntry => ({
	duration,
	interactionId,
	entryType: 'event',
	name: 'keydown',
	startTime: 0,
	toJSON: () => ({}),
	...overrides,
});

/**
 * Makes an event report itself as real user input. `isTrusted` is unforgeable and reads jsdom's
 * internal object, which `dispatchEvent` sets to `false`, so the getter is replaced there.
 */
const trust = (event: Event): void => {
	const [implSymbol] = Object.getOwnPropertySymbols(event);
	const impl = (event as unknown as Record<symbol, object>)[implSymbol];
	Object.defineProperty(impl, 'isTrusted', { get: () => true, set: () => {} });
};

/**
 * One event of an interaction. `timeStamp` is read-only on a constructed event, so it is defined
 * onto it: it is what ties the event to the entry that measures it.
 */
export const interactionEvent = (
	type: string,
	timeStamp: number,
	{ trusted = true }: { trusted?: boolean } = {},
): Event => {
	const event = new Event(type, { bubbles: true });
	Object.defineProperty(event, 'timeStamp', { value: timeStamp });

	if (trusted) {
		trust(event);
	}

	return event;
};

/** Dispatches one event of an interaction, the way the browser would. */
export const dispatchInteraction = (
	target: EventTarget,
	type: string,
	timeStamp: number,
	options: { trusted?: boolean } = {},
): void => {
	target.dispatchEvent(interactionEvent(type, timeStamp, options));
};

/** The last one installed, which is the one the collector under test subscribed. */
export const observer = (): FakePerformanceObserver => {
	const observers = FakePerformanceObserver.instances.filter(
		(instance) => instance.observedWith?.type === 'event',
	);

	return observers[observers.length - 1];
};

/** Flushes the microtask `InteractionObserver` delays its callback by. */
export const flushObserverCallback = (): Promise<undefined> =>
	Promise.resolve().then(() => undefined);

/** Delivers entries the way the browser would, asynchronously. */
export const deliver = async (entries: FakeEntry[]): Promise<void> => {
	await deliverTo(observer(), entries);
};

/**
 * Delivers entries to one observer. A real editor has other observers of its own, so a test
 * that mounts one has to say which observer the interactions belong to.
 */
export const deliverTo = async (
	target: FakePerformanceObserver,
	entries: FakeEntry[],
): Promise<void> => {
	target.deliver(entries);
	await flushObserverCallback();
};

/** Declares Event Timing support. Call once per file, from `beforeAll`. */
export const declareEventTimingSupport = (): void => {
	Object.defineProperty(window, 'PerformanceEventTiming', {
		configurable: true,
		value: class {
			get interactionId() {
				return 0;
			}
		},
	});
};

/** Installs the fake observer and resets the recorded instances. Call from `beforeEach`. */
export const installFakeObserver = (supportedEntryTypes: string[] = ['event']): void => {
	FakePerformanceObserver.instances = [];
	FakePerformanceObserver.supportedEntryTypes = supportedEntryTypes;
	// @ts-expect-error - swapping in the fake observer
	window.PerformanceObserver = FakePerformanceObserver;
};

/** How many interactions the page reports, including those below the reporting threshold. */
export const setPageInteractionCount = (count: number | undefined): void => {
	Object.defineProperty(performance, 'interactionCount', {
		configurable: true,
		get: () => count,
	});
};

export const setVisibility = (visibilityState: 'visible' | 'hidden'): void => {
	Object.defineProperty(document, 'visibilityState', {
		configurable: true,
		get: () => visibilityState,
	});
	document.dispatchEvent(new Event('visibilitychange'));
};
