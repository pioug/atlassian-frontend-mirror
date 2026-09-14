import { extractPayload } from './extract-payload';
import { num } from './num';

/**
 * largest-contentful-paint: keep only startTime + size.
 * Mirrors the bridge's own emission shape: { startTime, size }.
 * Drops: elapsed, envelope name — no other fields are sent by the bridge.
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function shapeLargestContentfulPaintData(
	data: Record<string, unknown>,
): Record<string, unknown> {
	const payload = extractPayload(data);
	return {
		startTime: num(payload.startTime),
		size: num(payload.size),
	};
}
