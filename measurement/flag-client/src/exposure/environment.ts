/**
 * The host capabilities exposure delivery uses, behind one seam so tests can supply fakes and the
 * logger never touches globals directly. Not part of the public API.
 */

/** The subset of the Web Storage API persistence uses. */
export interface ExposureStorage {
	readonly length: number;
	key(index: number): string | null;
	getItem(key: string): string | null;
	setItem(key: string, value: string): void;
	removeItem(key: string): void;
}

/** The request options every delivery sends. */
export interface ExposureRequestInit {
	readonly method: 'POST';
	readonly headers: Readonly<Record<string, string>>;
	readonly body: string;
	readonly credentials: 'omit';
	/** Aborts the request once delivery abandons it. */
	readonly signal?: AbortSignal;
}

/** The subset of a `fetch` response delivery inspects. */
export interface ExposureResponse {
	readonly status: number;
	/** The unread body, cancelled so the host can release the connection. */
	readonly body?: { cancel(): Promise<void> } | null;
}

export type ExposureFetch = (url: string, init: ExposureRequestInit) => Promise<ExposureResponse>;

/** Callbacks for the page becoming hidden or visible again. */
export interface PageLifecycleListener {
	hidden(): void;
	visible(): void;
}

export interface ExposureEnvironment {
	now(): number;
	setTimeout(callback: () => void, delayMs: number): unknown;
	clearTimeout(handle: unknown): void;
	/** Run a callback once the current task's synchronous work is done, before the next task. */
	queueMicrotask(callback: () => void): void;
	/** A uniformly distributed number in `[0, 1)`. */
	random(): number;
	/** An identifier unique to one client instance, used in its storage key. */
	newInstanceId(): string;
	/** The `fetch` implementation, or `undefined` when the host has none. */
	readonly fetch: ExposureFetch | undefined;
	/** A new controller for aborting an abandoned request, or `undefined` when the host has none. */
	abortController(): AbortController | undefined;
	/** The page's `localStorage`, or `null` when it does not exist or cannot be accessed. */
	storage(): ExposureStorage | null;
	/**
	 * Register for page-lifecycle changes, reporting `hidden` at once when the page is already hidden.
	 * Does nothing outside a browser page.
	 */
	onPageLifecycle(listener: PageLifecycleListener): void;
}

/** The environment backed by the host's globals. */
export function defaultExposureEnvironment(): ExposureEnvironment {
	const hostFetch = typeof globalThis.fetch === 'function' ? globalThis.fetch : undefined;
	return {
		now: () => Date.now(),
		setTimeout: (callback, delayMs) => {
			const handle = globalThis.setTimeout(callback, delayMs);
			// Outside a browser, a pending delivery must not keep the process alive.
			(handle as { unref?: () => void } | null)?.unref?.();
			return handle;
		},
		// A promise job is a microtask in every host, so this needs no host global.
		queueMicrotask: (callback) => {
			void Promise.resolve().then(callback);
		},
		clearTimeout: (handle) => {
			globalThis.clearTimeout(handle as Parameters<typeof globalThis.clearTimeout>[0]);
		},
		random: () => Math.random(),
		newInstanceId: () =>
			globalThis.crypto?.randomUUID?.() ??
			`${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`,
		fetch:
			hostFetch === undefined
				? undefined
				: (url, init) => hostFetch.call(globalThis, url, init) as Promise<ExposureResponse>,
		abortController: () =>
			typeof AbortController === 'function' ? new AbortController() : undefined,
		storage: () => {
			try {
				// A public @atlaskit package cannot depend on @atlassian/browser-storage-controls; the
				// storage key must be registered for Browser Storage Controls before this ships.
				// eslint-disable-next-line @atlaskit/platform/no-direct-web-storage-usage -- see above
				return typeof window === 'undefined' ? null : (window.localStorage ?? null);
			} catch {
				// Reading `window.localStorage` throws a `SecurityError` when storage is blocked.
				return null;
			}
		},
		onPageLifecycle: (listener) => {
			if (typeof window === 'undefined' || typeof document === 'undefined') return;
			document.addEventListener('visibilitychange', () => {
				if (document.visibilityState === 'hidden') listener.hidden();
				else listener.visible();
			});
			window.addEventListener('pagehide', () => listener.hidden());
			// A page restored from the back/forward cache may not report a `visibilitychange`.
			window.addEventListener('pageshow', (event) => {
				if ((event as PageTransitionEvent).persisted && document.visibilityState === 'visible') {
					listener.visible();
				}
			});
			// A page opened in the background or prerendered starts hidden without a `visibilitychange`.
			if (document.visibilityState === 'hidden') listener.hidden();
		},
	};
}

let environmentFactory: () => ExposureEnvironment = defaultExposureEnvironment;

/** The environment an enabled client's logger uses. */
export function createExposureEnvironment(): ExposureEnvironment {
	return environmentFactory();
}

/**
 * Replace the environment enabled clients are constructed with, or restore the default when called
 * without a factory. For tests only; it is not exported from the package entry point.
 */
export function setExposureEnvironmentFactory(factory?: () => ExposureEnvironment): void {
	environmentFactory = factory ?? defaultExposureEnvironment;
}
