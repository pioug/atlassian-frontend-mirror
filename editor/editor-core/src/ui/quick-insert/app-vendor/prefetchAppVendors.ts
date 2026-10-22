import type { MenuItem } from '@atlaskit/editor-common/extensions/types/utils';
import { logException } from '@atlaskit/editor-common/monitoring/error';

import { type AppVendorEntry, appVendorCache } from './appVendorCache';
import type { AppVendorBatchResult, QueuedLookup } from './fetchAppVendorsInBatches';
import { getAppVendorLookup } from './getAppVendorLookup';

/** Failed lookups are retried on later menu opens, up to this many attempts per page load. */
const MAX_ATTEMPTS = 3;
const LOG_LOCATION = 'editor-core/quick-insert/prefetchAppVendors';

const { entries, listeners } = appVendorCache;

/**
 * Set once any batch fails with 401, 403, or 429. Those mean the session cannot read Marketplace
 * data or the gateway is throttling, which applies to every editor on the page, so all further
 * lookups stop until the page reloads.
 */
let isBlocked = false;

const shouldFetch = (entry: AppVendorEntry | undefined): boolean =>
	!entry || (entry.status === 'failed' && entry.attempts < MAX_ATTEMPTS);

const getAttempts = (entry: AppVendorEntry | undefined): number =>
	entry?.status === 'failed' ? entry.attempts : 0;

// A throwing subscriber must not stop the others or abort the batch that is being settled.
const notify = () =>
	listeners.forEach((listener) => {
		try {
			listener();
		} catch (error) {
			logException(error as Error, { location: LOG_LOCATION });
		}
	});

const markFailed = ({ attempts, id }: QueuedLookup) =>
	entries.set(id, { attempts, status: 'failed' });

const settleBatch = (batch: QueuedLookup[], result: AppVendorBatchResult) => {
	if (result.status !== 'fulfilled') {
		if (result.status === 'rejected') {
			isBlocked ||= result.isBlocking;
			logException(result.error as Error, { location: LOG_LOCATION });
		}
		batch.forEach(markFailed);
		return;
	}

	// Lookups missing from the result errored individually and stay retryable.
	batch.forEach((lookup) => {
		const name = result.names.get(lookup.id);
		if (name === undefined) {
			markFailed(lookup);
		} else {
			entries.set(lookup.id, { name, status: 'resolved' });
		}
	});
	notify();
};

/**
 * Starts fetching Marketplace partner names for every ecosystem app among `items`.
 * Safe to call repeatedly: cached, in-flight, and exhausted lookups are skipped. The fetching code
 * is loaded only once a lookup is queued.
 */
export const prefetchAppVendors = (items: Pick<MenuItem, 'app' | 'extensionType'>[]): void => {
	if (isBlocked) {
		return;
	}

	const lookups: QueuedLookup[] = [];
	items.forEach((item) => {
		const lookup = getAppVendorLookup(item);
		const entry = lookup && entries.get(lookup.id);
		if (lookup && shouldFetch(entry)) {
			lookups.push({ ...lookup, attempts: getAttempts(entry) + 1 });
			entries.set(lookup.id, { status: 'pending' });
		}
	});
	if (lookups.length === 0) {
		return;
	}

	void import(
		/* webpackChunkName: "@atlaskit-internal_editor-core-quick-insert-app-vendor" */ './fetchAppVendorsInBatches'
	)
		.then(
			({ fetchAppVendorsInBatches }) =>
				fetchAppVendorsInBatches(lookups, {
					onBatch: settleBatch,
					shouldContinue: () => !isBlocked,
				}),
			(error) => {
				// The chunk failed to load; nothing was requested, so every queued lookup can retry.
				lookups.forEach(markFailed);
				logException(error as Error, { location: LOG_LOCATION });
			},
		)
		.catch((error) => {
			// Fetch errors are reported per batch; this only catches an unexpected throw while settling.
			logException(error as Error, { location: LOG_LOCATION });
		});
};
