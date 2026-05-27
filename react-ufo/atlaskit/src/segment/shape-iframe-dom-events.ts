/**
 * Iframe event shaping helpers
 *
 * These functions normalise raw Forge bridge event data into compact, consistent
 * shapes before storing in segment3pTimings, reducing payload size and aligning
 * with the equivalent host-page metrics where applicable.
 *
 * Each function receives the full raw event object (minus `type`) and returns
 * only the fields worth retaining in the analytics payload.
 */

const num = (v: unknown): number => (typeof v === 'number' ? Math.round(v) : 0);

function extractPayload(data: Record<string, unknown>): Record<string, unknown> {
	return data.payload !== null && typeof data.payload === 'object'
		? (data.payload as Record<string, unknown>)
		: {};
}

/**
 * paint-timing: keep only name + startTime (mirrors host-side getPaintMetricsToLegacyFormat).
 * Drops: elapsed, envelope name, duration (always 0), entryType (always 'paint').
 */
export function shapePaintTimingData(data: Record<string, unknown>): Record<string, unknown> {
	const payload = extractPayload(data);
	return {
		name: typeof payload.name === 'string' ? payload.name : '',
		startTime: num(payload.startTime),
	};
}

/**
 * frame-mark: keep only entryName + startTime.
 * Drops: elapsed, envelope name, detail (arbitrary/potentially large user data).
 */
export function shapeFrameMarkData(data: Record<string, unknown>): Record<string, unknown> {
	const payload = extractPayload(data);
	return {
		entryName: typeof payload.entryName === 'string' ? payload.entryName : '',
		startTime: num(payload.startTime),
	};
}

/**
 * frame-measure: keep only entryName + startTime + duration.
 * Drops: elapsed, envelope name, detail (arbitrary/potentially large user data).
 */
export function shapeFrameMeasureData(data: Record<string, unknown>): Record<string, unknown> {
	const payload = extractPayload(data);
	return {
		entryName: typeof payload.entryName === 'string' ? payload.entryName : '',
		startTime: num(payload.startTime),
		duration: num(payload.duration),
	};
}

/**
 * layout-shift: keep value, startTime, cumulativeScore, sessionValue, and source node names.
 * Drops: elapsed, envelope name, duration (always 0), hadRecentInput (always false — entries
 * with hadRecentInput:true are filtered out before emit), lastInputTime (low analytical value),
 * and currentRect/previousRect from sources (8 floats per source — high cost, low value).
 */
export function shapeLayoutShiftData(data: Record<string, unknown>): Record<string, unknown> {
	const payload = extractPayload(data);
	const rawSources = Array.isArray(payload.sources) ? payload.sources : [];
	const sources = rawSources.map((source: unknown) => {
		const s =
			source !== null && typeof source === 'object' ? (source as Record<string, unknown>) : {};
		return { node: typeof s.node === 'string' ? s.node : 'unknown' };
	});
	return {
		value: typeof payload.value === 'number' ? payload.value : 0,
		startTime: num(payload.startTime),
		cumulativeScore: typeof payload.cumulativeScore === 'number' ? payload.cumulativeScore : 0,
		sessionValue: typeof payload.sessionValue === 'number' ? payload.sessionValue : 0,
		sources,
	};
}

/**
 * Returns true only for the final dom-mutations batch, which is the one worth recording.
 * Intermediate batches (isFinalBatch === false/undefined) are skipped by the caller.
 */
export function isDomMutationsFinalBatch(data: Record<string, unknown>): boolean {
	const payload = extractPayload(data);
	return payload.isFinalBatch === true;
}

/**
 * dom-mutations (final batch only): keep summary counters + stopReason.
 * Intermediate batches are skipped entirely in the caller (third-party-segment.tsx).
 * Drops: elapsed, envelope name, per-mutation details (addedNodeDetails / removedNodeDetails),
 * isTimedOut (redundant with stopReason), isFinalBatch (always true at this point),
 * and individual mutation objects (too verbose; totalMutations covers the count).
 */
export function shapeDomMutationsData(data: Record<string, unknown>): Record<string, unknown> {
	const payload = extractPayload(data);
	return {
		totalMutations: typeof payload.totalMutations === 'number' ? payload.totalMutations : 0,
		observationDurationMs: num(payload.observationDurationMs),
		stopReason: typeof payload.stopReason === 'string' ? payload.stopReason : null,
	};
}
