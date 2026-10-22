import { AppVendorRequestError } from './AppVendorRequestError';
import { fetchAppVendors } from './fetchAppVendors';
import type { AppVendorLookup } from './getAppVendorLookup';

/** Marketplace has no bulk lookup; larger aliased requests time out. */
const BATCH_SIZE = 15;
const MAX_CONCURRENT_BATCHES = 3;

export type QueuedLookup = AppVendorLookup & { attempts: number };

export type AppVendorBatchResult =
	| { names: Map<string, string | null>; status: 'fulfilled' }
	| { error: unknown; isBlocking: boolean; status: 'rejected' }
	| { status: 'skipped' };

/**
 * Fetches lookups in batches, at most `MAX_CONCURRENT_BATCHES` at a time, reporting each batch as it
 * settles. Batches that have not started when `shouldContinue` returns false are reported as skipped.
 * Loaded on demand so editors without ecosystem apps never download the fetching code.
 */
export const fetchAppVendorsInBatches = async (
	lookups: QueuedLookup[],
	{
		onBatch,
		shouldContinue,
	}: {
		onBatch: (batch: QueuedLookup[], result: AppVendorBatchResult) => void;
		shouldContinue: () => boolean;
	},
): Promise<void> => {
	const batches: QueuedLookup[][] = [];
	for (let start = 0; start < lookups.length; start += BATCH_SIZE) {
		batches.push(lookups.slice(start, start + BATCH_SIZE));
	}

	let nextBatch = 0;
	const runWorker = async () => {
		while (nextBatch < batches.length) {
			const batch = batches[nextBatch++];
			if (!shouldContinue()) {
				onBatch(batch, { status: 'skipped' });
				continue;
			}
			// Only the request is caught, so a batch is never reported twice.
			let names: Map<string, string | null>;
			try {
				names = await fetchAppVendors(batch);
			} catch (error) {
				const isBlocking = error instanceof AppVendorRequestError && error.isBlocking;
				onBatch(batch, { error, isBlocking, status: 'rejected' });
				continue;
			}
			onBatch(batch, { names, status: 'fulfilled' });
		}
	};

	await Promise.all(
		Array.from({ length: Math.min(MAX_CONCURRENT_BATCHES, batches.length) }, runWorker),
	);
};
