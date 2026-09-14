import { extractPayload } from './extract-payload';
import { num } from './num';

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
