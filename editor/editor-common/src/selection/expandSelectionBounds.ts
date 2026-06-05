import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';

/**
 *
 * @param $anchor Resolved selection anchor position
 * @param $head Resolved selection head position
 * @returns An expanded selection encompassing surrounding nodes. Hoists up to the shared depth anchor/head depths differ.
 */
export const expandSelectionBounds = (
	$anchor: ResolvedPos,
	$head: ResolvedPos,
): { $anchor: ResolvedPos; $head: ResolvedPos } => {
	const sharedDepth = $anchor.sharedDepth($head.pos) + 1;
	const $from = $anchor.min($head);
	const $to = $anchor.max($head);
	const fromDepth = $from.depth;
	const toDepth = $to.depth;

	let selectionStart: number;
	let selectionEnd: number;

	const selectionHasGrandparent = toDepth > 1 && fromDepth > 1;
	const selectionIsAcrossDiffParents =
		selectionHasGrandparent && !$to.parent.isTextblock && !$to.sameParent($from);
	const selectionIsAcrossTextBlocksWithDiffParents =
		selectionHasGrandparent &&
		$to.parent.isTextblock &&
		$to.before(toDepth - 1) !== $from.before(fromDepth - 1);

	if (toDepth > fromDepth) {
		selectionStart = $from.before(sharedDepth);
		selectionEnd = $to.after(sharedDepth);
	} else if (toDepth < fromDepth) {
		selectionStart = $from.before(sharedDepth);
		selectionEnd = $to.after(sharedDepth);
	} else if (selectionIsAcrossDiffParents || selectionIsAcrossTextBlocksWithDiffParents) {
		// when selection from/to share same depth with different parents, hoist up the selection to the parent of the highest depth in the selection
		selectionStart = $from.before(sharedDepth);
		selectionEnd = $to.after(sharedDepth);
	} else if (!$from.node().inlineContent) {
		// when selection might be a Node selection, return what was passed in
		return { $anchor, $head };
	} else {
		selectionStart = fromDepth ? $from.before() : $from.pos;
		selectionEnd = toDepth ? $to.after() : $to.pos;
	}

	const $expandedFrom = $anchor.doc.resolve(selectionStart);
	const $expandedTo = $anchor.doc.resolve(selectionEnd);

	return {
		$anchor: $anchor === $from ? $expandedFrom : $expandedTo,
		$head: $head === $to ? $expandedTo : $expandedFrom,
	};
};
