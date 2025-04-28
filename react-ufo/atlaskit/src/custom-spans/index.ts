import { addSpanToAll } from '../interaction-metrics';

export function addCustomSpans(
	name: string,
	start: number,
	end: number = performance.now(),
	size = 0,
) {
	addSpanToAll('custom', name, [{ name: 'custom' }], start, end, size);
}
