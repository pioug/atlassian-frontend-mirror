import { restoreSelection, computeSelectionOffsets } from '@atlaskit/editor-common/lists';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import { MAX_NESTED_LIST_INDENTATION } from '../../types';
import { findFirstParentListNode, findRootParentListNode } from '../utils/find';
import { buildReplacementFragment, flattenList } from '../utils/list-indentation';

/**
 * Moves the selected list items n levels up (negative delta) or down (positive delta).
 */
export function moveSelectedListItems(tr: Transaction, indentDelta: number): void {
	const originalSelection = tr.selection;

	// Find the root list so depth adjustments are absolute
	const rootListResolved = findRootParentListNode(originalSelection.$from);
	if (!rootListResolved) {
		return;
	}

	const rootList = findFirstParentListNode(rootListResolved);
	if (!rootList) {
		return;
	}

	const rootListStart = rootList.pos;
	const rootListEnd = rootListStart + rootList.node.nodeSize;

	const result = flattenList({
		doc: tr.doc,
		rootListStart,
		rootListEnd,
		selectionFrom: originalSelection.from,
		selectionTo: originalSelection.to,
		indentDelta,
		maxDepth: MAX_NESTED_LIST_INDENTATION,
	});

	if (!result) {
		return;
	}

	const { items, startIndex, endIndex } = result;

	// Build replacement — handles both indent (all depths >= 0)
	// and outdent (some depths may be < 0, producing extracted paragraphs).
	const { fragment, contentStartOffsets } = buildReplacementFragment(items, tr.doc.type.schema);
	if (fragment.size === 0) {
		return;
	}

	tr.replaceWith(rootListStart, rootListEnd, fragment);

	const { from, to } = computeSelectionOffsets({
		items,
		startIndex,
		endIndex,
		originalFrom: originalSelection.from,
		originalTo: originalSelection.to,
		contentStartOffsets,
		rootListStart,
		docSize: tr.doc.content.size,
	});

	// Restore selection using the positional offsets from the rebuild.
	restoreSelection({ tr, originalSelection, from, to });
}
