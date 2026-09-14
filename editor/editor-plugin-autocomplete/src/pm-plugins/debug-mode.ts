/**
 * Contextual Typeahead Completions (CTC) debug logging utility.
 *
 * Logs are silent by default. Enable in any environment (dev, staging, prod):
 *
 *   // Live, for the current session (no reload required):
 *   __atlCtcDebug__.enable()
 *
 *   // To disable:
 *   __atlCtcDebug__.disable()
 *
 *   // From initial page load (survives reload) — append to the URL:
 *   ?atlCtcDebug=1
 *
 * Storage-free by design: avoids browser-storage consent controls (BSC), which can
 * block uncategorized localStorage/sessionStorage/cookie writes in some products.
 */

declare global {
	interface Window {
		__atlCtcDebug__?: {
			disable: () => void;
			/**
			 * Enable CTC debug logging for this session. Pass `'verbose'` to also
			 * emit the per-prediction candidate table, canonical LM, and grammar detail:
			 * `__atlCtcDebug__.enable('verbose')`.
			 */
			enable: (level?: 'verbose') => void;
			/**
			 * Snapshot of the inline-code surfaces harvested this session, or what a
			 * typed prefix would be offered: `__atlCtcDebug__.harvest('ml-s')`.
			 *
			 * Installed by the harvester rather than declared with the rest of the
			 * API, and typed as `unknown` so the return shape can live with the module
			 * that owns it instead of creating a cycle back to this one. Undefined
			 * until the harvester chunk has loaded.
			 */
			harvest?: (typedPrefix?: string) => unknown;
			isEnabled: () => boolean;
			/** Whether verbose logging (candidate tables + extra detail) is on. */
			isVerbose: () => boolean;
			/**
			 * Snapshot of the L1 session boosts — the vocabulary words this session
			 * has seen and how often — or one family of them:
			 * `__atlCtcDebug__.session('poll')`.
			 *
			 * Installed by the predictor for the same reasons as `harvest` above, and
			 * distinct from it: this reports known words whose frequency the session
			 * raised, while `harvest` holds surfaces the vocabulary does not have.
			 */
			session?: (prefix?: string) => unknown;
		};
	}
}

/**
 * Shared `%c` styles for all CTC console output, so every log — lifecycle,
 * async signals, and per-prediction groups — reads consistently.
 */
export const CTC_STYLES = {
	brand: 'color: #00b8d9; font-weight: bold;',
	section: 'color: #9c27b0; font-weight: bold;',
	dim: 'color: #888; font-style: italic;',
	good: 'color: #4caf50; font-weight: bold;',
	warn: 'color: #ff9800; font-weight: bold;',
	bad: 'color: #f44336; font-weight: bold;',
	cold: 'color: #9e9e9e; font-weight: bold;',
	lm: 'color: #e83e8c; font-weight: bold;',
	body: 'color: inherit; font-weight: normal;',
};

/**
 * Log one aligned section line inside a per-prediction group, e.g.
 * `INPUT      raw: "…"`. Label is padded so the bodies line up. No-ops unless
 * debug is enabled, so callers don't need to guard.
 */
export const ctcSection = (label: string, body: string): void => {
	if (!isAutocompleteDebugEnabled()) {
		return;
	}
	// eslint-disable-next-line no-console
	console.log(`%c${label.padEnd(10)}%c${body}`, CTC_STYLES.section, CTC_STYLES.body);
};

/**
 * Log a lifecycle / async-signal line (outside the per-prediction groups),
 * tagged `[CTC:<tag>]`. No-ops unless debug is enabled, so callers don't need to
 * guard. Use tags like `init` (loads) and `signal` (slow-lane arrivals).
 */
export const ctcTag = (tag: string, body: string, tagStyle: string = CTC_STYLES.brand): void => {
	if (!isAutocompleteDebugEnabled()) {
		return;
	}
	// eslint-disable-next-line no-console
	console.log(`%c[CTC:${tag}]%c ${body}`, tagStyle, CTC_STYLES.body);
};

const readUrlDebugFlag = (): { enabled: boolean; verbose: boolean } => {
	if (typeof window === 'undefined') {
		return { enabled: false, verbose: false };
	}
	try {
		const value = new URLSearchParams(window.location.search).get('atlCtcDebug');
		return { enabled: value === '1' || value === 'verbose', verbose: value === 'verbose' };
	} catch {
		return { enabled: false, verbose: false };
	}
};

const printLegend = (verbose: boolean): void => {
	// eslint-disable-next-line no-console
	console.groupCollapsed(
		`%c[CTC]%c debug enabled${verbose ? ' (verbose)' : ''} — Contextual Typeahead Completion`,
		CTC_STYLES.brand,
		CTC_STYLES.body,
	);
	// eslint-disable-next-line no-console
	console.log(
		'%cPipeline%c  INPUT → SIGNALS → CANONICAL → GENERATE → SCORE → ARBITRATE → STABILIZE → CANDIDATES',
		CTC_STYLES.section,
		CTC_STYLES.body,
	);
	// eslint-disable-next-line no-console
	console.log(
		'%cEvidence%c  Tier A = exact-context first token · prefix = one more decoded token · exact = every token of the surface scored · absent = Stage 1',
		CTC_STYLES.section,
		CTC_STYLES.body,
	);
	// eslint-disable-next-line no-console
	console.log(
		'%cLM queue%c  one serialised GPU queue drains both: prompt prefills and single-token decode steps',
		CTC_STYLES.section,
		CTC_STYLES.body,
	);
	// eslint-disable-next-line no-console
	console.log(
		'%cPlanes%c    [CTC:init] loads · [CTC:signal] semantic/network · [CTC:model] primes/exact · [CTC:model-cost] prefill/decode · [CTC:readiness] deadline progress',
		CTC_STYLES.section,
		CTC_STYLES.body,
	);
	// eslint-disable-next-line no-console
	console.log(
		'%cInspect%c   __atlCtcDebug__.enable("verbose") · .disable() · .harvest() (session inline code) · .session() (L1 boosts) — both narrow to a prefix, e.g. .session("poll")',
		CTC_STYLES.section,
		CTC_STYLES.body,
	);
	// eslint-disable-next-line no-console
	console.groupEnd();
};

// State lives on the window object (not a module closure) so duplicate copies of this
// module across separate bundles/realms share one source of truth and the console API
// controls them all. In-memory only; persisted across reload via the URL flag.
const getDebugApi = (): Window['__atlCtcDebug__'] => {
	if (typeof window === 'undefined') {
		return undefined;
	}
	if (!window.__atlCtcDebug__) {
		const initial = readUrlDebugFlag();
		let debugEnabled = initial.enabled;
		let debugVerbose = initial.verbose;
		if (debugEnabled) {
			printLegend(debugVerbose);
		}
		window.__atlCtcDebug__ = {
			enable: (level?: 'verbose') => {
				debugEnabled = true;
				debugVerbose = level === 'verbose';
				printLegend(debugVerbose);
			},
			disable: () => {
				debugEnabled = false;
				debugVerbose = false;
			},
			isEnabled: () => debugEnabled,
			isVerbose: () => debugEnabled && debugVerbose,
		};
	}
	return window.__atlCtcDebug__;
};

export const isAutocompleteDebugEnabled = (): boolean => getDebugApi()?.isEnabled() ?? false;

export const isAutocompleteDebugVerbose = (): boolean => getDebugApi()?.isVerbose() ?? false;

/**
 * Hang the harvest snapshot off the console API.
 *
 * Unlike the log helpers this is available whether or not debug is enabled:
 * inspecting state on demand is not logging, and asking someone to turn on
 * logging and retype to find out what the session already holds defeats the
 * point of being able to ask.
 */
export const registerCtcHarvestInspector = (inspect: (typedPrefix?: string) => unknown): void => {
	const api = getDebugApi();
	if (api) {
		api.harvest = inspect;
	}
};

/**
 * Hang the L1 session-boost snapshot off the console API, on the same terms as
 * `registerCtcHarvestInspector`: available whether or not logging is on.
 */
export const registerCtcSessionInspector = (inspect: (prefix?: string) => unknown): void => {
	const api = getDebugApi();
	if (api) {
		api.session = inspect;
	}
};

// Eagerly install so the console API is available on load, regardless of call order.
getDebugApi();
