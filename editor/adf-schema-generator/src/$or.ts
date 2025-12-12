import type { ADFNode } from './adfNode';
import type { ADFNodeGroup } from './types/ADFNodeGroup';
import type { ADFNodeContentOrSpec } from './types/ADFNodeSpec';

/**
 * Create a content expression that allows any of the specified content items.
 * Equivalent to `(paragraph | blockquote)` in prosemirror content expressions.
 * https://prosemirror.net/docs/guide/#schema.content_expressions
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function $or(...content: Array<ADFNode<any> | ADFNodeGroup>): ADFNodeContentOrSpec {
	return { type: '$or', content };
}
