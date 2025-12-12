import type { ADFNodeContentSpec, ADFNodeContentZeroOrMoreSpec } from './types/ADFNodeSpec';

/**
 * Create a content expression that allows zero or more of the specified content items.
 * Equivalent to `paragraph*` in prosemirror content expressions.
 * https://prosemirror.net/docs/guide/#schema.content_expressions
 */
export function $zeroPlus(content: ADFNodeContentSpec): ADFNodeContentZeroOrMoreSpec {
	return { type: '$zero+', content };
}
