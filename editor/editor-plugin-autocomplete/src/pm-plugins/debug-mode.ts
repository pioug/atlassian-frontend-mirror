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
			enable: () => void;
			disable: () => void;
			isEnabled: () => boolean;
		};
	}
}

const hasUrlDebugFlag = (): boolean => {
	if (typeof window === 'undefined') {
		return false;
	}
	try {
		return new URLSearchParams(window.location.search).get('atlCtcDebug') === '1';
	} catch {
		return false;
	}
};

// State lives on the window object (not a module closure) so duplicate copies of this
// module across separate bundles/realms share one source of truth and the console API
// controls them all. In-memory only; persisted across reload via the URL flag.
const getDebugApi = (): Window['__atlCtcDebug__'] => {
	if (typeof window === 'undefined') {
		return undefined;
	}
	if (!window.__atlCtcDebug__) {
		let debugEnabled = hasUrlDebugFlag();
		window.__atlCtcDebug__ = {
			enable: () => {
				debugEnabled = true;
			},
			disable: () => {
				debugEnabled = false;
			},
			isEnabled: () => debugEnabled,
		};
	}
	return window.__atlCtcDebug__;
};

export const isAutocompleteDebugEnabled = (): boolean => getDebugApi()?.isEnabled() ?? false;

// Eagerly install so the console API is available on load, regardless of call order.
getDebugApi();
