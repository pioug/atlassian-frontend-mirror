import { addSpanToAll } from '../interaction-metrics';
import { withProfiling } from '../self-measurements';

export const addCustomSpans = withProfiling(function addCustomSpans(
	name: string,
	start: number,
	end: number = performance.now(),
	size = 0,
) {
	addSpanToAll('custom', name, [{ name: 'custom' }], start, end, size);
});
