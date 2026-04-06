import { expandToBlockRange, isMultiBlockRange } from '@atlaskit/editor-common/selection';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { NodeRange, Node as PMNode, ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import { TextSelection, type Selection, type Transaction } from '@atlaskit/editor-prosemirror/state';
import { selectTableClosestToPos } from '@atlaskit/editor-tables/utils';

import type { BlockControlsPlugin } from '../../blockControlsPluginType';

import { selectNode } from './getSelection';
import { adjustSelectionBoundsForEdgePositions } from './selection';

const isPosWithinRange = (pos: number, range: NodeRange): boolean => {
	return range.start <= pos && range.end >= pos + 1;
};

type CalculateSelectionBlockRangeOptions = {
	doc: PMNode;
	isShiftPressed: boolean;
	resolvedStartPos: ResolvedPos;
	selection: Selection;
};

/**
 * Expands the current selection to encompass the full block range
 * starting from the given resolved position.
 */
const getExpandedSelectionRange = ({
	selection,
	doc,
	resolvedStartPos,
	isShiftPressed,
}: CalculateSelectionBlockRangeOptions) => {
	// When not pressing shift, expand the current selection
	// When shift selecting upwards, expand from start of node to selection end
	// When shift selecting downwards, expand from selection start to end of node
	const selectUp = resolvedStartPos.pos < selection.from;
	const $from = isShiftPressed && selectUp ? resolvedStartPos : selection.$from;
	const $to = isShiftPressed && !selectUp ? doc.resolve(resolvedStartPos.pos + 1) : selection.$to;

	const adjusted = isShiftPressed
		? { $from, $to }
		: adjustSelectionBoundsForEdgePositions($from, $to);

	return expandToBlockRange(adjusted.$from, adjusted.$to);
};

export type ExpandAndUpdateSelectionOptions = {
	api: ExtractInjectionAPI<BlockControlsPlugin>;
	isShiftPressed: boolean;
	nodeType: string;
	selection: Selection;
	startPos: number;
	tr: Transaction;
};

/**
 * Updates the transaction's selection based on the clicked drag handle position.
 *
 * - If the clicked handle is within an existing multi-block selection range, the selection
 *   is expanded to cover both the existing range and the clicked node's range.
 * - For tables, a table cell selection is used.
 * - Otherwise, selects the single node at the clicked handle position.
 */
export const expandAndUpdateSelection = ({
	tr,
	selection,
	startPos,
	isShiftPressed,
	nodeType,
	api,
}: ExpandAndUpdateSelectionOptions): void => {
	const resolvedStartPos = tr.doc.resolve(startPos);

	const expandedRange = getExpandedSelectionRange({
		doc: tr.doc,
		selection,
		resolvedStartPos,
		isShiftPressed,
	});

	// Set selection to expanded selection range if it encompasses the clicked drag handle
	if (
		expandedRange.range &&
		isPosWithinRange(startPos, expandedRange.range) &&
		isMultiBlockRange(expandedRange.range)
	) {
		// Then create a selection from the start of the first node to the end of the last node
		tr.setSelection(
			TextSelection.create(
				tr.doc,
				Math.min(selection.from, expandedRange.$from.pos),
				Math.max(selection.to, expandedRange.$to.pos),
			),
		);
	} else if (nodeType === 'table') {
		selectTableClosestToPos(tr, tr.doc.resolve(startPos + 1));
	} else {
		// Select the clicked drag handle's node only
		selectNode(tr, startPos, nodeType, api);
	}
};
