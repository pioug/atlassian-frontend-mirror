/**
 * Timing constants for expand animation and DOM update delays.
 * These values are tuned for the expand component's behavior and React's update cycle.
 */
export const SCROLL_TO_BLOCK_TIMING = {
	/** Minimal delay for DOM/React updates after expanding (no animation in expand component). */
	DOM_UPDATE_DELAY: 50,
	/** Delay when expand operation fails and needs retry. */
	RETRY_DELAY: 100,
	/** Maximum number of retry attempts before giving up and scrolling anyway. */
	MAX_ATTEMPTS: 5,
	/** Maximum depth of nested expands to search (prevents infinite loops). */
	MAX_EXPAND_DEPTH: 2,
} as const;
