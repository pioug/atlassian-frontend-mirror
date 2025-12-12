import type { ADFNodeContentSpec, ADFNodeContentRangeSpec } from './types/ADFNodeSpec';

/**
 * Create a content expression that allows to limit number of children.
 * Equivalent to `paragraph{min,max}` in prosemirror content expressions.
 * https://prosemirror.net/docs/guide/#schema.content_expressions
 */
export function $range(
	min: number,
	max: number,
	content: ADFNodeContentSpec,
): ADFNodeContentRangeSpec {
	return { type: '$range', min, max, content };
}
