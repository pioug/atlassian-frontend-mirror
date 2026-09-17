import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { NodeViewSerializer } from '../../NodeViewSerializer';

/**
 * Node types that can safely be reduced to an empty shell.
 *
 * A shell only replicates a margin if it collapses to nothing itself, which needs zero height and
 * no vertical border or padding. Textblocks and lists qualify; nodes with intrinsic sizing (tables
 * are `display: table`, media has a measured height) or a painted box (a zero-height panel is a
 * visible stripe of background) do not, and are left alone.
 */
const isShapeableNode = (node: PMNode): boolean =>
	node.isTextblock || ['bulletList', 'orderedList'].includes(node.type.name);

/**
 * An invisible element shaped like `node`, used to supply the top margin `node` no longer gets.
 *
 * A node at the start of its parent has its top margin reset, so a diff widget rendered above it
 * sits flush against it. The reset cannot simply be taken off the node: the container variants skip
 * widgets when counting — `nth-child(1 of :not(style, .ProseMirror-gapcursor, .ProseMirror-widget,
 * span))` in layout columns, expands, sync blocks and table cells — so no amount of extra elements
 * moves the match. That exclusion is what makes this work instead: the spacer is a
 * `.ProseMirror-widget`, so it is never the counted first child and keeps its own margin, while the
 * real node goes on taking the reset.
 *
 * The margin is not measured. Reading it off the real node is impossible — by then the reset has
 * set it to `0`, and both `firstBlockNodeStyles` (`!important`) and block controls' `firstNodeDec`
 * (an inline style) make it unrecoverable. Instead the spacer carries the node's own tag, classes
 * and attributes, so the same rules that would have given the node its margin match the spacer
 * (`.ProseMirror p`, `.ProseMirror h2`, the root-list rule, and so on).
 *
 * Returns `null` when the node is not safely shapeable or serialization fails.
 */
export const createNodeShapedMarginSpacer = ({
	node,
	serializer,
	testId,
}: {
	node: PMNode;
	serializer: NodeViewSerializer;
	testId: string;
}): HTMLElement | null => {
	if (!isShapeableNode(node)) {
		return null;
	}

	// An empty node of the same type serializes to the same shell without walking real content.
	const shellNode = node.type.createAndFill(node.attrs) ?? node;
	const serialized = serializer.serializeNode(shellNode);

	if (!(serialized instanceof HTMLElement)) {
		return null;
	}

	// Keep the tag, classes and attributes the margin rules select on; drop anything that could
	// occupy a line box.
	serialized.replaceChildren();
	serialized.dataset.testid = testId;
	serialized.setAttribute('aria-hidden', 'true');
	serialized.contentEditable = 'false';

	// Zero height with no vertical border or padding keeps the spacer self-collapsing: its margins
	// stay adjoining, so they collapse with the neighbours into a single margin equal to the largest
	// rather than adding to them. That is what makes this safe in containers that never reset the
	// first child — the spacer cannot double the gap there. Deliberately no `overflow: hidden`, which
	// would open a block formatting context and stop that collapsing.
	serialized.style.height = '0';
	serialized.style.minHeight = '0';
	serialized.style.paddingTop = '0';
	serialized.style.paddingBottom = '0';
	serialized.style.borderTopWidth = '0';
	serialized.style.borderBottomWidth = '0';
	// Only the top margin is being replicated. Left as-is, a larger bottom margin would win the
	// self-collapse and overshoot the gap.
	serialized.style.marginBottom = '0';

	return serialized;
};
