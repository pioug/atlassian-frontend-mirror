import type {
	ExposureEnvironment,
	ExposureFetch,
	ExposureRequestInit,
	ExposureResponse,
	ExposureStorage,
	PageLifecycleListener,
} from '../../exposure/environment';
import type { ExposureRecord } from '../../exposure/otlp';

export interface FakeRequest {
	readonly url: string;
	readonly init: ExposureRequestInit;
	respond(status: number, body?: ExposureResponse['body']): void;
	fail(error?: unknown): void;
}

/** In-memory `localStorage` with switchable failures. */
export class FakeStorage implements ExposureStorage {
	readonly items: Map<string, string> = new Map<string, string>();
	failWrites = false;
	failReads = false;
	failRemoves = false;

	get length(): number {
		return this.items.size;
	}

	key(index: number): string | null {
		return [...this.items.keys()][index] ?? null;
	}

	getItem(key: string): string | null {
		if (this.failReads) throw new Error('SecurityError');
		return this.items.get(key) ?? null;
	}

	setItem(key: string, value: string): void {
		if (this.failWrites) throw new Error('QuotaExceededError');
		this.items.set(key, value);
	}

	removeItem(key: string): void {
		if (this.failRemoves) throw new Error('SecurityError');
		this.items.delete(key);
	}
}

interface FakeTimer {
	readonly id: number;
	readonly due: number;
	readonly callback: () => void;
}

/** A deterministic environment: manual clock and timers, recorded requests, fake storage. */
export class FakeExposureEnvironment implements ExposureEnvironment {
	nowMs = 0;
	randomValue = 0.5;
	hasAbortController = true;
	readonly requests: FakeRequest[] = [];
	readonly listeners: PageLifecycleListener[] = [];
	storageImpl: ExposureStorage | null;
	fetch: ExposureFetch | undefined = (url, init) =>
		new Promise((resolve, reject) => {
			this.requests.push({
				url,
				init,
				respond: (status, body) => resolve(body === undefined ? { status } : { status, body }),
				fail: (error = new TypeError('Failed to fetch')) => reject(error),
			});
		});
	private timers: FakeTimer[] = [];
	private nextTimerId = 0;
	private nextInstanceId = 0;
	private readonly instanceIdPrefix: string;
	private pageHidden = false;

	/** Use a distinct `instanceIdPrefix` per simulated tab so instances never share a key. */
	constructor(storage: ExposureStorage | null = new FakeStorage(), instanceIdPrefix = 'instance') {
		this.storageImpl = storage;
		this.instanceIdPrefix = instanceIdPrefix;
	}

	now(): number {
		return this.nowMs;
	}

	setTimeout(callback: () => void, delayMs: number): unknown {
		this.nextTimerId += 1;
		this.timers.push({ id: this.nextTimerId, due: this.nowMs + delayMs, callback });
		return this.nextTimerId;
	}

	clearTimeout(handle: unknown): void {
		this.timers = this.timers.filter((timer) => timer.id !== handle);
	}

	queueMicrotask(callback: () => void): void {
		queueMicrotask(callback);
	}

	random(): number {
		return this.randomValue;
	}

	abortController(): AbortController | undefined {
		return this.hasAbortController ? new AbortController() : undefined;
	}

	newInstanceId(): string {
		this.nextInstanceId += 1;
		return `${this.instanceIdPrefix}-${this.nextInstanceId}`;
	}

	storage(): ExposureStorage | null {
		return this.storageImpl;
	}

	onPageLifecycle(listener: PageLifecycleListener): void {
		this.listeners.push(listener);
		if (this.pageHidden) listener.hidden();
	}

	get pendingTimers(): number {
		return this.timers.length;
	}

	/** Advance the clock, firing due timers in order. */
	advance(ms: number): void {
		const target = this.nowMs + ms;
		for (;;) {
			const next = [...this.timers].sort((a, b) => a.due - b.due || a.id - b.id)[0];
			if (next === undefined || next.due > target) break;
			this.timers = this.timers.filter((timer) => timer !== next);
			this.nowMs = next.due;
			next.callback();
		}
		this.nowMs = target;
	}

	/** Hide the page. Before a logger exists, it is constructed in a hidden page. */
	hide(): void {
		this.pageHidden = true;
		for (const listener of this.listeners) listener.hidden();
	}

	show(): void {
		this.pageHidden = false;
		for (const listener of this.listeners) listener.visible();
	}
}

/** Let promise continuations, such as delivery completion, run. */
export async function settle(): Promise<void> {
	// eslint-disable-next-line @atlaskit/platform/no-set-immediate -- flushes promise continuations, not UI
	await new Promise((resolve) => setImmediate(resolve));
}

export function exposure(flagKey: string, serviceVersion?: string): ExposureRecord {
	return {
		resource: {
			serviceName: 'jira-frontend',
			...(serviceVersion === undefined ? {} : { serviceVersion }),
		},
		scopeVersion: '0.1.0',
		logRecord: {
			timeUnixNano: '0',
			severityNumber: 1,
			severityText: 'TRACE',
			eventName: 'flag-evaluated',
			attributes: [{ key: 'feature_flag.key', value: { stringValue: flagKey } }],
		},
	};
}

/** The flag keys in a request body, in order. */
export function deliveredFlagKeys(request: FakeRequest): string[] {
	const body = JSON.parse(request.init.body) as {
		resourceLogs: {
			scopeLogs: {
				logRecords: { attributes: { key: string; value: { stringValue?: string } }[] }[];
			}[];
		}[];
	};
	return body.resourceLogs.flatMap((resource) =>
		resource.scopeLogs.flatMap((scope) =>
			scope.logRecords.map(
				(record) =>
					record.attributes.find((attribute) => attribute.key === 'feature_flag.key')?.value
						.stringValue ?? '',
			),
		),
	);
}
