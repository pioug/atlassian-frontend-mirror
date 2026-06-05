/**
 * Error codes for synced blocks preloading
 * Used for tracking and monitoring errors during SSR preload phase
 */
export const SyncedBlocksSSRErrorCodeMap = {
	/**
	 * Occurs when the fetch operation returns fewer results than requested.
	 * This indicates incomplete data retrieval or potential data loss.
	 * Included in error: list of missing block identifiers
	 */
	FETCH_INCOMPLETE: 'SYNCED_BLOCKS_FETCH_INCOMPLETE',

	/**
	 * Occurs when the batch fetch operation throws an error during execution.
	 * This indicates a network error, timeout, or API failure.
	 * Included in error: resource IDs that failed to fetch
	 */
	BATCH_FETCH_FAILED: 'SYNCED_BLOCKS_BATCH_FETCH_FAILED',

	/**
	 * Occurs when the fetch operation times out without returning results.
	 * This is specific to the bulk fetch operation with a configurable timeout.
	 */
	FETCH_TIMEOUT: 'SYNCED_BLOCKS_FETCH_TIMEOUT',
} as const;
