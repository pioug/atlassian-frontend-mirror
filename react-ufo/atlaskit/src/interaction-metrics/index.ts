import { type Span } from '../common/types';

export const interactionSpans: Span[] = [];

export function addCustomSpans(
	name: string,
	start: number,
	end: number = performance.now(),
	size = 0,
) {
	const customSpan: Span = {
		type: 'custom',
		name,
		start,
		end,
		labelStack: [{ name: 'custom' }],
		size,
	};

	interactionSpans.push(customSpan);
}
