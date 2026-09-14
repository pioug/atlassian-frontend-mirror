import { extractPayload } from './extract-payload';
import { num } from './num';

/**
 * layout-shift: keep value, startTime, cumulativeScore, sessionValue, and source node names.
 * Drops: elapsed, envelope name, duration (always 0), hadRecentInput (always false — entries
 * with hadRecentInput:true are filtered out before emit), lastInputTime (low analytical value),
 * and currentRect/previousRect from sources (8 floats per source — high cost, low value).
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
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
