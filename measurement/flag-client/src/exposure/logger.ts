/**
 * Exposure deduplication, batching, delivery, retry, and page-lifecycle persistence. Not part of the
 * public API.
 */
import { ExposureDeduplicator } from './deduplication';
import {
	defaultExposureEnvironment,
	type ExposureEnvironment,
	type ExposureResponse,
	type ExposureStorage,
} from './environment';
import { encodeExportLogsRequest, type ExposureRecord } from './otlp';
import {
	DELIVERY_MARKER_FRESH_MS,
	DELIVERY_MARKER_KEY,
	DELIVERY_MARKER_REFRESH_MS,
	deliveryMarkerAge,
	MAX_PERSISTED_CODE_UNITS,
	parseExposures,
	serializeExposuresWithinBudget,
	STORAGE_KEY_PREFIX,
	UNDELIVERED_ORIGIN_CODE_UNITS,
	type QueuedExposure,
} from './persistence';

export const INITIAL_RETRY_DELAY_MS = 1000;
/** Retry and probe delays vary randomly by up to this fraction in either direction. */
export const RETRY_JITTER = 0.2;
/** A delivery not settled this long after it was sent is abandoned and retried. */
export const DELIVERY_TIMEOUT_MS = 30_000;
/**
 * The most exposures a client keeps queued while its most recent delivery failed retryably, so a
 * failure that never clears cannot grow memory for the life of the page.
 */
export const MAX_QUEUED_WHILE_FAILING = 1000;
/** Consecutive retryable failures after which the circuit breaker opens. */
export const BREAKER_FAILURE_THRESHOLD = 3;
/** While the circuit breaker is open, one delivery is let through this often. */
export const BREAKER_PROBE_INTERVAL_MS = 60_000;

/** The resolved delivery options of an enabled logger. */
export interface ExposureDeliveryOptions {
	readonly endpoint: string;
	readonly batchSize: number;
	readonly flushIntervalMs: number;
}

export interface ExposureLogger {
	/**
	 * Queue an exposure unless its identity is within a deduplication window. `produce` runs only
	 * when the exposure is queued.
	 */
	log(identityKey: string, produce: () => ExposureRecord): void;
	/** End every deduplication window, as a successful replacement requires. */
	endDeduplicationWindows(): void;
}

/** The logger of a disabled client. It never touches network, storage, timers, or listeners. */
export const NOOP_EXPOSURE_LOGGER: ExposureLogger = Object.freeze({
	log: () => undefined,
	endDeduplicationWindows: () => undefined,
});

/** Create an enabled logger. Construction reclaims exposures persisted by earlier pages. */
export function createExposureLogger(
	options: ExposureDeliveryOptions,
	environment: ExposureEnvironment = defaultExposureEnvironment(),
): ExposureLogger {
	return new DeliveringExposureLogger(options, environment);
}

type DeliveryOutcome = 'delivered' | 'retryable' | 'terminal';

/** Rate limiting and server errors are expected to clear, so they are retried. */
function isRetryableStatus(status: number): boolean {
	return status === 429 || (status >= 500 && status < 600);
}

/** Cancel a response body that delivery never reads, so hosts such as Node free the connection. */
function discardBody(response: ExposureResponse): void {
	try {
		response.body?.cancel().catch(() => undefined);
	} catch {
		// A body that cannot be cancelled is left to the host; the status still decides the outcome.
	}
}

class DeliveringExposureLogger implements ExposureLogger {
	private readonly deduplicator = new ExposureDeduplicator();
	private readonly storageKey: string;
	private queue: QueuedExposure[] = [];
	/** When each exposure was queued or taken; a retry puts entries back ahead of newer ones. */
	private readonly queuedOrder = new WeakMap<QueuedExposure, number>();
	private nextQueuedOrder = 0;
	private inFlight: readonly QueuedExposure[] | null = null;
	/**
	 * Consecutive retryable failures. At {@link BREAKER_FAILURE_THRESHOLD} the circuit breaker is
	 * open: exposures stay queued, and only a periodic probe delivery is sent until one succeeds.
	 * Every exposure, including those taken from storage, goes to the configured endpoint, so one
	 * breaker covers them all.
	 */
	private consecutiveFailures = 0;
	/** While the breaker is open, the timer that lets the next probe through, or `null` once due. */
	private probeTimer: { readonly handle: unknown } | null = null;
	private flushTimer: { readonly handle: unknown } | null = null;
	private retryTimer: { readonly handle: unknown } | null = null;
	/**
	 * The entries last written under this instance's key, or `null` while nothing is persisted. The
	 * key's owner is whoever removes it, so entries taken by another instance are not delivered here.
	 */
	private persisted: ReadonlySet<QueuedExposure> | null = null;
	private readonly options: ExposureDeliveryOptions;
	private readonly environment: ExposureEnvironment;
	/** Whether the page is hidden, so each exposure queued now is persisted when it is queued. */
	private hidden = false;
	private persistQueued = false;

	constructor(options: ExposureDeliveryOptions, environment: ExposureEnvironment) {
		this.options = options;
		this.environment = environment;
		this.storageKey = `${STORAGE_KEY_PREFIX}${environment.newInstanceId()}`;
		// A take found by either callback cancels any retry, so exposures it was holding back are
		// scheduled. Registration comes before the reclaim, so a registration that throws leaves other
		// instances' entries in storage rather than taking them into a logger that is then discarded.
		environment.onPageLifecycle({
			hidden: () => {
				this.hidden = true;
				this.persist();
				this.schedule();
			},
			visible: () => {
				this.hidden = false;
				this.unpersist();
				this.schedule();
			},
		});
		this.reclaim();
		// A page already hidden at registration persisted before the reclaim, so it writes again to
		// include the reclaimed entries.
		if (this.hidden) this.persist();
		// Exposures just taken are sent now, subject to the breaker, rather than after the flush
		// interval, so a page whose deliveries fail knows it moments after it loads. With nothing
		// taken, the queue is empty and nothing is sent.
		this.deliver();
	}

	log(identityKey: string, produce: () => ExposureRecord): void {
		if (!this.deduplicator.admit(identityKey, this.environment.now())) return;
		let record: ExposureRecord;
		try {
			record = produce();
		} catch {
			// Nothing was queued, so the identity must not stay suppressed, and the failure stays here.
			this.deduplicator.forget(identityKey);
			return;
		}
		this.queue.push(this.track({ record, attempts: 0 }));
		this.trim();
		// A hidden page can be discarded without another hidden signal, so persist the exposure before
		// this task ends. A page is never frozen or discarded mid-task, so one write covers the task.
		if (this.hidden && !this.persistQueued) {
			this.persistQueued = true;
			this.environment.queueMicrotask(() => {
				this.persistQueued = false;
				if (!this.hidden) return;
				this.persist();
				// A take found here cancels any retry, so exposures it was holding back are scheduled.
				this.schedule();
			});
		}
		this.scheduleAfterLog();
	}

	endDeduplicationWindows(): void {
		this.deduplicator.clear();
	}

	/** Start a delivery when one is due, or arm the flush timer for queued exposures. */
	private schedule(): void {
		if (this.inFlight !== null || this.retryTimer !== null) return;
		const due = this.due();
		if (due === 'now') {
			this.deliver();
		} else if (due === 'flush' && this.flushTimer === null) {
			this.armFlushTimer(this.options.flushIntervalMs);
		}
	}

	/**
	 * When queued exposures are due: now for a full batch or a due probe, after the flush interval
	 * otherwise, or never while they wait on an open breaker.
	 */
	private due(): 'now' | 'flush' | 'none' {
		if (this.queue.length === 0 || !this.isSendable()) return 'none';
		if (this.queue.length >= this.options.batchSize) return 'now';
		return this.isOpen() ? 'now' : 'flush';
	}

	/**
	 * Schedule as {@link schedule} does, except that a full batch is sent from a zero-delay timer. A
	 * `log` call runs inside a flag read, so encoding the batch and starting `fetch` wait for a later
	 * task.
	 */
	private scheduleAfterLog(): void {
		if (this.inFlight !== null || this.retryTimer !== null) return;
		if (this.due() !== 'now') {
			this.schedule();
			return;
		}
		if (this.flushTimer !== null) this.environment.clearTimeout(this.flushTimer.handle);
		this.armFlushTimer(0);
	}

	private armFlushTimer(delayMs: number): void {
		this.flushTimer = {
			handle: this.environment.setTimeout(() => {
				this.flushTimer = null;
				if (this.inFlight === null && this.retryTimer === null) this.deliver();
			}, delayMs),
		};
	}

	/** Send up to `batchSize` queued exposures, oldest first, unless the breaker holds them back. */
	private deliver(): void {
		if (this.flushTimer !== null) {
			this.environment.clearTimeout(this.flushTimer.handle);
			this.flushTimer = null;
		}
		// A flush or retry timer can fire after another instance took this page's persisted entries.
		if (this.persisted !== null) {
			const storage = this.environment.storage();
			if (storage !== null) this.wasTaken(storage, this.persisted);
		}
		if (this.queue.length === 0 || !this.isSendable()) return;
		const batch = this.queue.slice(0, this.options.batchSize);
		this.queue = this.queue.slice(this.options.batchSize);
		this.inFlight = batch;
		// Single-flight delivery depends on `complete` always running, so a rejection settles too.
		void this.send(batch).then(
			(outcome) => this.complete(outcome),
			() => this.complete('terminal'),
		);
	}

	private async send(batch: readonly QueuedExposure[]): Promise<DeliveryOutcome> {
		const fetch = this.environment.fetch;
		// Without `fetch`, retrying could never succeed, so an explicitly enabled client stops here.
		if (fetch === undefined) return 'terminal';
		let body: string;
		try {
			body = JSON.stringify(encodeExportLogsRequest(batch.map((entry) => entry.record)));
		} catch {
			// A batch that cannot be encoded can never be sent, so it is discarded like a terminal status.
			return 'terminal';
		}
		// A request that never settles would hold up every later delivery, so it is abandoned.
		const controller = this.environment.abortController();
		let timer: unknown;
		const timedOut = new Promise<'retryable'>((resolve) => {
			timer = this.environment.setTimeout(() => {
				controller?.abort();
				resolve('retryable');
			}, DELIVERY_TIMEOUT_MS);
		});
		try {
			const request = fetch(this.options.endpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body,
				credentials: 'omit',
				...(controller === undefined ? {} : { signal: controller.signal }),
			});
			const response = await Promise.race([request, timedOut]);
			if (response === 'retryable') {
				// A request that is not aborted can still settle, and its body is then cancelled unread.
				void request.then(discardBody, () => undefined);
				return 'retryable';
			}
			discardBody(response);
			if (response.status >= 200 && response.status < 300) return 'delivered';
			return isRetryableStatus(response.status) ? 'retryable' : 'terminal';
		} catch {
			return 'retryable';
		} finally {
			this.environment.clearTimeout(timer);
		}
	}

	/** Settle the in-flight batch, less any entries another instance took while it was in flight. */
	private complete(outcome: DeliveryOutcome): void {
		const batch = this.inFlight ?? [];
		this.inFlight = null;
		if (outcome === 'retryable') {
			for (const entry of batch) entry.attempts += 1;
			this.queue = [...batch, ...this.queue];
			this.consecutiveFailures += 1;
			// Exposures the bound keeps wait for the backoff too, even when it dropped the batch.
			const trimmed = this.trim();
			// Another instance may have taken the batch, so check before arming the retry.
			this.syncPersisted();
			if (this.isOpen()) {
				this.armProbeTimer();
			} else {
				this.armRetryTimer(batch, this.consecutiveFailures, trimmed);
			}
		} else {
			// Any response other than a retryable one shows the endpoint is healthy again.
			this.consecutiveFailures = 0;
			if (outcome === 'delivered') this.markDelivered();
			this.syncPersisted();
		}
		this.schedule();
	}

	/**
	 * Hold back delivery while a failed batch waits to be retried, or while the exposures the queue
	 * bound kept in its place wait. With nothing left to retry, exposures queued since then are
	 * scheduled without the backoff. A take filters the queue in order, so any batch entry that
	 * survives is still first.
	 */
	private armRetryTimer(
		batch: readonly QueuedExposure[],
		failures: number,
		trimmed: boolean,
	): void {
		const head = this.queue[0];
		if (head === undefined || (!trimmed && !batch.includes(head))) return;
		this.retryTimer = {
			handle: this.environment.setTimeout(
				() => {
					this.retryTimer = null;
					if (this.inFlight === null) this.deliver();
				},
				this.jittered(INITIAL_RETRY_DELAY_MS * 2 ** (failures - 1)),
			),
		};
	}

	/** Let the next probe through the open breaker once the probe interval elapses. */
	private armProbeTimer(): void {
		this.probeTimer = {
			handle: this.environment.setTimeout(() => {
				this.probeTimer = null;
				this.schedule();
			}, this.jittered(BREAKER_PROBE_INTERVAL_MS)),
		};
	}

	private isOpen(): boolean {
		return this.consecutiveFailures >= BREAKER_FAILURE_THRESHOLD;
	}

	/** Whether the most recent delivery failed retryably, including while the breaker is open. */
	private isFailing(): boolean {
		return this.consecutiveFailures > 0;
	}

	/** Whether queued exposures may be sent: the breaker is closed or its probe is due. */
	private isSendable(): boolean {
		return !this.isOpen() || this.probeTimer === null;
	}

	/**
	 * While the most recent delivery failed retryably, keep only the
	 * {@link MAX_QUEUED_WHILE_FAILING} exposures queued or taken most recently, since the queue may
	 * never drain. Returns whether any were discarded.
	 */
	private trim(): boolean {
		if (!this.isFailing() || this.queue.length <= MAX_QUEUED_WHILE_FAILING) return false;
		const orders = this.queue.map(this.order).sort((a, b) => b - a);
		const oldestKept = orders[MAX_QUEUED_WHILE_FAILING - 1] ?? 0;
		this.queue = this.queue.filter((entry) => this.order(entry) >= oldestKept);
		return true;
	}

	private jittered(delayMs: number): number {
		return delayMs * (1 - RETRY_JITTER + 2 * RETRY_JITTER * this.environment.random());
	}

	private undelivered(): QueuedExposure[] {
		return [...(this.inFlight ?? []), ...this.queue];
	}

	/** Synchronously write every undelivered exposure under this instance's key. */
	private persist(): void {
		const storage = this.environment.storage();
		if (storage === null) return;
		// A second hidden signal, such as `pagehide` after `visibilitychange`, must not recreate a key
		// another instance has taken in between.
		if (this.persisted !== null) this.wasTaken(storage, this.persisted);
		const entries = this.undelivered();
		if (entries.length === 0) {
			this.removeKey(storage);
			return;
		}
		this.write(storage, entries);
	}

	/**
	 * After a delivery outcome, rewrite the key with every undelivered entry, including those queued
	 * since it was written, or remove it when none remain. A missing key means another instance took
	 * the entries.
	 */
	private syncPersisted(): void {
		const persisted = this.persisted;
		if (persisted === null) return;
		const storage = this.environment.storage();
		if (storage === null || this.wasTaken(storage, persisted)) return;
		const entries = this.undelivered();
		if (entries.length === 0) {
			this.removeKey(storage);
		} else {
			this.write(storage, entries);
		}
	}

	/** Back on the page: remove this instance's key and continue from memory. */
	private unpersist(): void {
		const persisted = this.persisted;
		if (persisted === null) return;
		const storage = this.environment.storage();
		if (storage === null || this.wasTaken(storage, persisted)) return;
		this.removeKey(storage);
	}

	/**
	 * Whether another instance removed this instance's key. If so, it owns the entries written there,
	 * so queued and in-flight copies are dropped and are neither persisted nor retried here again.
	 */
	private wasTaken(storage: ExposureStorage, persisted: ReadonlySet<QueuedExposure>): boolean {
		let present: boolean;
		try {
			present = storage.getItem(this.storageKey) !== null;
		} catch {
			// Unreadable storage is not evidence of a take, so keep tracking the key for later rewrites
			// and removal; otherwise a stale entry would be reclaimed and delivered again.
			return false;
		}
		if (present) return false;
		const isOwned = (entry: QueuedExposure): boolean => !persisted.has(entry);
		this.queue = this.queue.filter(isOwned);
		if (this.inFlight !== null) this.inFlight = this.inFlight.filter(isOwned);
		this.persisted = null;
		// An armed retry is for entries the key held, so it now has nothing to retry and would hold
		// back exposures queued since it was armed; callers schedule those.
		if (this.retryTimer !== null) {
			this.environment.clearTimeout(this.retryTimer.handle);
			this.retryTimer = null;
		}
		return true;
	}

	private track(entry: QueuedExposure): QueuedExposure {
		this.queuedOrder.set(entry, this.nextQueuedOrder);
		this.nextQueuedOrder += 1;
		return entry;
	}

	/** When an entry was queued or taken. Every entry is tracked then, so the fallback is unused. */
	private readonly order = (entry: QueuedExposure): number => this.queuedOrder.get(entry) ?? 0;

	/**
	 * Record a successful delivery for the origin, unless the marker already records one within
	 * {@link DELIVERY_MARKER_REFRESH_MS}.
	 */
	private markDelivered(): void {
		const storage = this.environment.storage();
		if (storage === null) return;
		const now = this.environment.now();
		try {
			const age = deliveryMarkerAge(storage, now);
			if (age === null || age >= DELIVERY_MARKER_REFRESH_MS) {
				storage.setItem(DELIVERY_MARKER_KEY, String(now));
			}
		} catch {
			// Without the marker, a later failure only persists less.
		}
	}

	/**
	 * The origin's storage budget: the full budget unless deliveries are failing on an origin with no
	 * successful delivery within {@link DELIVERY_MARKER_FRESH_MS}, as when a content blocker rejects
	 * every request, whose exposures may never be delivered.
	 */
	private budget(storage: ExposureStorage): number {
		if (!this.isFailing()) return MAX_PERSISTED_CODE_UNITS;
		const age = deliveryMarkerAge(storage, this.environment.now());
		return age !== null && age < DELIVERY_MARKER_FRESH_MS
			? MAX_PERSISTED_CODE_UNITS
			: UNDELIVERED_ORIGIN_CODE_UNITS;
	}

	/**
	 * Write the newest entries that fit the origin's storage budget; the others stay in memory only,
	 * and with none that fit the key is removed.
	 */
	private write(storage: ExposureStorage, entries: readonly QueuedExposure[]): void {
		try {
			const budgeted = serializeExposuresWithinBudget(
				storage,
				this.storageKey,
				entries,
				this.order,
				this.options.endpoint,
				this.budget(storage),
			);
			if (budgeted.entries.length === 0) {
				this.removeKey(storage);
				return;
			}
			storage.setItem(this.storageKey, budgeted.text);
			this.persisted = new Set(budgeted.entries);
		} catch {
			// A failed write keeps the exposures in memory only, so no stale copy may remain.
			this.removeKey(storage);
		}
	}

	private removeKey(storage: ExposureStorage): void {
		try {
			storage.removeItem(this.storageKey);
			this.persisted = null;
		} catch {
			// Storage failures never reach callers. The key still holds `persisted`, so keep tracking it
			// for a later outcome or return to the page to remove; otherwise it would be reclaimed and
			// delivered again.
		}
	}

	/**
	 * Take every exposure other instances persisted for this origin. They are delivered to this
	 * instance's endpoint, whatever endpoint their writer was configured with.
	 */
	private reclaim(): void {
		const storage = this.environment.storage();
		if (storage === null) return;
		const keys: string[] = [];
		try {
			for (let index = 0; index < storage.length; index += 1) {
				const key = storage.key(index);
				if (key !== null && key.startsWith(STORAGE_KEY_PREFIX) && key !== this.storageKey) {
					keys.push(key);
				}
			}
		} catch {
			return;
		}
		for (const key of keys) {
			let text: string | null;
			try {
				text = storage.getItem(key);
				storage.removeItem(key);
			} catch {
				// An entry that could not be taken is left for its owner rather than delivered twice.
				continue;
			}
			if (text !== null) {
				for (const entry of parseExposures(text)) {
					this.queue.push(this.track(entry));
				}
			}
		}
	}
}
