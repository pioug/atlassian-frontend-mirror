import { extractPayload } from './extract-payload';
import { num } from './num';

/**
 * dom-mutations (final batch only): keep summary counters + stopReason.
 * Intermediate batches are skipped entirely in the caller (third-party-segment.tsx).
 * Drops: elapsed, envelope name, per-mutation details (addedNodeDetails / removedNodeDetails),
 * isTimedOut (redundant with stopReason), isFinalBatch (always true at this point),
 * and individual mutation objects (too verbose; totalMutations covers the count).
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function shapeDomMutationsData(data: Record<string, unknown>): Record<string, unknown> {
	const payload = extractPayload(data);
	return {
		totalMutations: typeof payload.totalMutations === 'number' ? payload.totalMutations : 0,
		observationDurationMs: num(payload.observationDurationMs),
		stopReason: typeof payload.stopReason === 'string' ? payload.stopReason : null,
	};
}
