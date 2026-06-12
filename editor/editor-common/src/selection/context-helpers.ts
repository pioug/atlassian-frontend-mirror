import { Fragment } from '@atlaskit/editor-prosemirror/model';
import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { Selection } from '@atlaskit/editor-prosemirror/state';

const listDepth = 3;

export const selectionCoversAllListItems = ($from: ResolvedPos, $to: ResolvedPos): boolean => {
	// Block level lists
	const listParents = ['bulletList', 'orderedList'];
	if ($from.depth >= listDepth && $to.depth >= listDepth && $from.depth === $to.depth) {
		// Get grandparents (from)
		const grandparentFrom = $from.node($from.depth - 1);
		const greatGrandparentFrom = $from.node($from.depth - 2);
		// Get grandparents (to)
		const grandparentTo = $to.node($from.depth - 1);
		const greatGrandparentTo = $to.node($from.depth - 2);
		if (
			greatGrandparentTo.eq(greatGrandparentFrom) &&
			listParents.includes(greatGrandparentFrom.type.name) &&
			// Selection covers entire list
			greatGrandparentFrom.firstChild?.eq(grandparentFrom) &&
			greatGrandparentFrom.lastChild?.eq(grandparentTo)
		) {
			return true;
		}
	}
	return false;
};

/**
 * Get the slice of the document corresponding to the selection.
 * This is similar to the prosemirror `selection.content()` - but
 * does not include the parents (unless the result is inline)
 *
 * @param selection The selection to get the slice for.
 * @returns The slice of the document corresponding to the selection.
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const getSliceFromSelection = (selection: Selection): Fragment => {
	const { from, to } = selection;
	if (from === to) {
		return Fragment.empty;
	}

	let frag = Fragment.empty;
	const sortedRanges = [...selection.ranges.slice()].sort((a, b) => a.$from.pos - b.$from.pos);
	for (const range of sortedRanges) {
		const { $from, $to } = range;
		const to = $to.pos;
		const depth =
			// If we're in a text selection, and share the parent node across the anchor->head
			// make the depth the parent node
			selection instanceof TextSelection && $from.parent.eq($to.parent)
				? Math.max(0, $from.sharedDepth(to) - 1)
				: $from.sharedDepth(to);
		let finalDepth = depth;
		// For block-level lists (non-nested) specifically use the selection
		if (selectionCoversAllListItems($from, $to)) {
			finalDepth = $from.depth - listDepth;
		}
		const start = $from.start(finalDepth);
		const node = $from.node(finalDepth);
		const content = node.content.cut($from.pos - start, $to.pos - start);
		frag = frag.append(content);
	}
	return frag;
};
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { getFragmentsFromSelection } from './getFragmentsFromSelection';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { getLocalIdsFromSelection } from './getLocalIdsFromSelection';
