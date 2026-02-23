import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE } from '../analytics';
import type { SyncedBlockSSRErrorAEP } from '../analytics/types/sync-block-events';
import { isSSR } from '../core-utils';

type BlockNodeIdentifiers = {
	blockInstanceId: string;
	resourceId: string;
};

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

export type SyncedBlocksSSRErrorCode =
	(typeof SyncedBlocksSSRErrorCodeMap)[keyof typeof SyncedBlocksSSRErrorCodeMap];

/**
 * This is the metadata structure for SSR errors stored in the window object.
 */
export type SyncedBlocksSSRErrorMetadata = {
	cloudId?: string;
	code: SyncedBlocksSSRErrorCode;
	contentId?: string;
	errorMessage?: string;
	errorName?: string;
	identifiers?: BlockNodeIdentifiers[];
	isBlog?: boolean;
	missingIdentifiers?: BlockNodeIdentifiers[];
};

interface WindowWithSSRErrors extends Window {
	__SSR_ERROR__?: unknown[];
}

interface SSRErrorObj {
	error: {
		message?: string;
		stack?: string;
	};
	meta: SyncedBlocksSSRErrorMetadata;
}

const isSyncedBlocksSSRErrorObj = (maybeSSRErrorObj: unknown): maybeSSRErrorObj is SSRErrorObj => {
	if (!maybeSSRErrorObj || typeof maybeSSRErrorObj !== 'object') {
		return false;
	}

	const errorWrapper = maybeSSRErrorObj as SSRErrorObj;

	// Check for meta object with valid code
	const hasValidMeta =
		errorWrapper.meta &&
		typeof errorWrapper.meta === 'object' &&
		Object.values(SyncedBlocksSSRErrorCodeMap).includes(
			(errorWrapper.meta as Record<string, unknown>).code as SyncedBlocksSSRErrorCode,
		);

	return Boolean(hasValidMeta);
};

/**
 * Get the first SSR error for synced blocks from the window.__SSR_ERROR__ array.
 *
 * Expected structure of error objects stored in confluence window.__SSR_ERROR__ for synced blocks SSR errors:
 *
 * @example
 * {
 *   error: {
 *     message: "Synced blocks fetch operation timed out",
 *     stack: "Error: Synced blocks fetch operation timed out\n    at /tmp/script.js:xxx:xxx"
 *   },
 *   meta: {
 *     code: "SYNCED_BLOCKS_FETCH_TIMEOUT",
 *     contentId: "XXXXXX",
 *     cloudId: "XXXX-XXXX-XXXX-XXXX-XXXX",
 *     isBlog: false,
 *     identifiers: [
 *       {
 *         resourceId: "confluence-page/XXXXXX/XXXX-XXXX-XXXX-XXXX-XXXX",
 *         blockInstanceId: "XXXX-XXXX-XXXX-XXXX-XXXX"
 *       }
 *     ]
 *   }
 * }
 *
 * @returns The first SSR error metadata, or undefined if no error found
 */
const getSyncedBlocksSSRError = (): SyncedBlocksSSRErrorMetadata | undefined => {
	if (isSSR()) {
		return undefined;
	}

	const ssrErrors = (window as WindowWithSSRErrors).__SSR_ERROR__;

	if (Array.isArray(ssrErrors)) {
		const syncedBlockErrors = ssrErrors
			.filter(isSyncedBlocksSSRErrorObj)
			.map((errorWrapper) => errorWrapper.meta as SyncedBlocksSSRErrorMetadata);

		return syncedBlockErrors.length > 0 ? syncedBlockErrors[0] : undefined;
	}

	return undefined;
};

/**
 * Fire analytics event for the first unprocessed SSR error that occurred during page rendering.
 * This function only runs ONCE per browser session to avoid duplicate analytics events.
 *
 * @param fireAnalyticsEvent - Function to fire analytics events
 */
export const handleSSRErrorsAnalytics = (() => {
	let called = false;
	// I want this fireAnalyticsEvent only takes in SyncedBlockSSRErrorAEP
	return (fireAnalyticsEvent?: (event: SyncedBlockSSRErrorAEP) => void) => {
		if (called) {
			return;
		}
		called = true;

		if (!fireAnalyticsEvent) {
			return;
		}

		const error = getSyncedBlocksSSRError();

		if (error) {
			fireAnalyticsEvent({
				action: ACTION.ERROR,
				actionSubject: ACTION_SUBJECT.SYNCED_BLOCK,
				actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_SSR_ERROR,
				eventType: EVENT_TYPE.OPERATIONAL,
				attributes: {
					code: error.code,
					isBlog: error.isBlog,
					syncedBlocksCount: error.identifiers?.length || 0,
					missingSyncedBlocksCount: error.missingIdentifiers?.length || 0,
					errorMessage: error.errorMessage,
					errorName: error.errorName,
				},
			});
		}
	};
})();
