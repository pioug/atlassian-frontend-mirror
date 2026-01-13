import { expandToBlockRange, isMultiBlockRange } from '@atlaskit/editor-common/selection';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import {
	NodeSelection,
	TextSelection,
	type ReadonlyTransaction,
	type Selection,
	type Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { getTableSelectionClosesToPos } from '@atlaskit/editor-tables/utils';

import type { BlockControlsPlugin } from '../../blockControlsPluginType';
import { getBlockControlsMeta, key } from '../main';

import { newGetSelection } from './getSelection';

export const getMultiSelectionIfPosInside = (
	api: ExtractInjectionAPI<BlockControlsPlugin>,
	pos: number,
	tr?: Transaction,
): { anchor?: number; head?: number } => {
	const pluginState = api?.blockControls?.sharedState.currentState();
	// With move nodes shortcut, we expand selection and move node within one transaction,
	// Hence we also look for `multiSelectDnD` in transaction meta
	const multiSelectDnD = pluginState?.multiSelectDnD ?? tr?.getMeta(key)?.multiSelectDnD;

	if (multiSelectDnD && multiSelectDnD.anchor >= 0 && multiSelectDnD.head >= 0) {
		const multiFrom = Math.min(multiSelectDnD.anchor, multiSelectDnD.head);
		const multiTo = Math.max(multiSelectDnD.anchor, multiSelectDnD.head);

		// We subtract one as the handle position is before the node
		return pos >= multiFrom - 1 && pos < multiTo
			? { anchor: multiSelectDnD.anchor, head: multiSelectDnD.head }
			: {};
	}
	return {};
};

/**
 * Given a handle position, returns the from and to positions of the selected content.
 * If the handle position is not in a multi-selection, it returns the node's from and to positions.
 *
 * @param handlePos The position of the handle
 * @param tr The transaction to use for position calculations
 * @param api The BlockControlsPlugin API for accessing shared state
 * @returns from and to positions of the selected content (after expansion)
 */
export const getSelectedSlicePosition = (
	handlePos: number,
	tr: Transaction,
	api: ExtractInjectionAPI<BlockControlsPlugin>,
) => {
	const { anchor, head } = getMultiSelectionIfPosInside(api, handlePos, tr);
	const inSelection = anchor !== undefined && head !== undefined;
	const from = inSelection ? Math.min(anchor || 0, head || 0) : handlePos;

	const activeNode = tr.doc.nodeAt(handlePos);
	const activeNodeEndPos = handlePos + (activeNode?.nodeSize ?? 1);
	const to = inSelection ? Math.max(anchor || 0, head || 0) : activeNodeEndPos;

	return { from, to };
};

/**
 * Takes a position and expands the selection to encompass the node at that position. Ignores empty or out of range selections.
 * Ignores positions that are in text blocks (i.e. not start of a node)
 * @returns TextSelection if expanded, otherwise returns Selection that was passed in.
 */
export const expandSelectionHeadToNodeAtPos = (
	selection: Selection,
	nodePos: number,
): Selection => {
	const doc = selection.$anchor.doc;
	if (nodePos < 0 || nodePos > doc.nodeSize - 2 || selection.empty) {
		return selection;
	}
	const $pos = doc.resolve(nodePos);
	const node = $pos.nodeAfter;
	if ($pos.node().isTextblock || !node) {
		return selection;
	}

	const $newHead = nodePos < selection.anchor ? $pos : doc.resolve(node.nodeSize + nodePos);
	const textSelection = new TextSelection(selection.$anchor, $newHead);
	return textSelection;
};

/**
 * This swaps the anchor/head for NodeSelections when its anchor > pos.
 * This is because NodeSelection always has an anchor at the start of the node,
 * which may not align with the existing selection.
 */
export const alignAnchorHeadInDirectionOfPos = (selection: Selection, pos: number): Selection => {
	return selection instanceof NodeSelection && Math.max(pos, selection.anchor) === selection.anchor
		? new TextSelection(selection.$head, selection.$anchor)
		: selection;
};

/**
 * This maps a preserved selection through a transaction, expanding text selections to block boundaries.
 *
 * @param selection The existing preserved selection to map
 * @param tr The transaction to map through
 * @returns The mapped selection or undefined if mapping is not possible
 */
export const mapPreservedSelection = (
	selection: Selection,
	tr: ReadonlyTransaction | Transaction,
): Selection | undefined => {
	const { preservedSelectionMapping } = getBlockControlsMeta(tr) || {};

	const mapping = preservedSelectionMapping || tr.mapping;

	const from = mapping.map(selection.from);
	const to = mapping.map(selection.to);

	const isSelectionEmpty = from === to;
	const wasSelectionEmpty = selection.from === selection.to;

	if (isSelectionEmpty && !wasSelectionEmpty) {
		// If selection has become empty i.e. content has been deleted, stop preserving
		return undefined;
	}

	return createPreservedSelection(tr.doc.resolve(from), tr.doc.resolve(to));
};

/**
 * Creates a preserved selection which is expanded to block boundaries.
 *
 * Will return the correct type of selection based on the nodes contained within the
 * expanded selection range.
 *
 * If the selection becomes empty or invalid, it returns undefined.
 *
 * @param $from The resolved position of the start of the selection
 * @param $to The resolved position of the end of the selection
 * @returns A Selection or undefined if selection is invalid
 */
export const createPreservedSelection = ($from: ResolvedPos, $to: ResolvedPos) => {
	const { doc } = $from;

	// expand the selection range to block boundaries, so selection always includes whole nodes
	const expanded = expandToBlockRange($from, $to);

	// stop preserving if selection becomes invalid
	if (
		expanded.$from.pos < 0 ||
		expanded.$to.pos > doc.content.size ||
		expanded.$from.pos >= expanded.$to.pos
	) {
		return undefined;
	}

	// If multiple blocks selected, create TextSelection from start of first node to end of last node
	if (expanded.range && isMultiBlockRange(expanded.range)) {
		return new TextSelection(expanded.$from, expanded.$to);
	}

	const nodeType = doc.nodeAt(expanded.$from.pos)?.type?.name;
	if (!nodeType) {
		return undefined;
	}

	if (nodeType === 'table') {
		return getTableSelectionClosesToPos($from);
	}

	return newGetSelection(doc, false, expanded.$from.pos) || undefined;
};
