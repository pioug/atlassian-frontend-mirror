import { expandToBlockRange } from '@atlaskit/editor-common/selection';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	NodeSelection,
	TextSelection,
	type ReadonlyTransaction,
	type Selection,
	type Transaction,
} from '@atlaskit/editor-prosemirror/state';

import type { BlockControlsPlugin } from '../../blockControlsPluginType';
import { getBlockControlsMeta, key } from '../main';

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

	if (selection instanceof TextSelection) {
		const from = mapping.map(selection.from);
		const to = mapping.map(selection.to);

		const isSelectionEmpty = from === to;
		const wasSelectionEmpty = selection.from === selection.to;

		if (isSelectionEmpty && !wasSelectionEmpty) {
			// If selection has become empty i.e. content has been deleted, stop preserving
			return undefined;
		}
		// expand the text selection range to block boundaries, so as document changes occur the
		// selection always includes whole nodes
		const expanded = expandToBlockRange(tr.doc.resolve(from), tr.doc.resolve(to));

		// If after expanding the selection it is still empty, return a single cursor selection at 'from'
		const nodeAfter = expanded.$from.nodeAfter;
		const nodeBefore = expanded.$to.nodeBefore;
		const expandedSelectionEmpty = nodeAfter === nodeBefore && nodeAfter?.content.size === 0;
		if (isSelectionEmpty && expandedSelectionEmpty) {
			return TextSelection.create(tr.doc, from);
		}

		const { $from, $to } = expanded;

		// stop preserving if preserved selection becomes invalid
		if ($from.pos < 0 || $to.pos > tr.doc.content.size || $from.pos >= $to.pos) {
			return undefined;
		}

		return new TextSelection($from, $to);
	}

	try {
		return selection.map(tr.doc, mapping);
	} catch {
		return undefined;
	}
};
