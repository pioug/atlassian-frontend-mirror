import type { ADFNodeContentSpec, ADFNodeContentOneOrMoreSpec } from './types/ADFNodeSpec';

/**
 * Create a content expression that allows one or more of the specified content items.
 * Equivalent to `paragraph+` in prosemirror content expressions.
 * https://prosemirror.net/docs/guide/#schema.content_expressions
 */
export function $onePlus(content: ADFNodeContentSpec): ADFNodeContentOneOrMoreSpec {
	return { type: '$one+', content };
}
