import { extractPayload } from './extract-payload';

/**
 * Returns true only for the final dom-mutations batch, which is the one worth recording.
 * Intermediate batches (isFinalBatch === false/undefined) are skipped by the caller.
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function isDomMutationsFinalBatch(data: Record<string, unknown>): boolean {
	const payload = extractPayload(data);
	return payload.isFinalBatch === true;
}
