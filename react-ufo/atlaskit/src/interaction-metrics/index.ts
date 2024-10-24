import { type LabelStack, type Span } from '../common/types';

export const interactionSpans: Span[] = [];

const defaultLabelStack = [{ name: 'custom' }];

export function addCustomSpans(
	name: string,
	start: number,
	end: number = performance.now(),
	size = 0,
	labelStack: LabelStack = defaultLabelStack,
) {
	const customSpan: Span = {
		type: 'custom',
		name,
		start,
		end,
		labelStack,
		size,
	};

	interactionSpans.push(customSpan);
}
