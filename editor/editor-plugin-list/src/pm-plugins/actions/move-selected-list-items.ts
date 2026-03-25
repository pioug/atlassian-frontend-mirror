import {
	computeSelectionOffsets,
	narrowReplacementRange,
	restoreSelection,
} from '@atlaskit/editor-common/lists';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import { MAX_NESTED_LIST_INDENTATION } from '../../types';
import { findFirstParentListNode, findRootParentListNode } from '../utils/find';
import { buildReplacementFragment, flattenList } from '../utils/list-indentation';

/**
 * Moves the selected list items n levels up (negative delta) or down (positive delta).
 */
export function moveSelectedListItems(tr: Transaction, indentDelta: number): void {
	const originalSelection = tr.selection;

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

	const { fragment, contentStartOffsets } = buildReplacementFragment(items, tr.doc.type.schema);
	if (fragment.size === 0) {
		return;
	}

	// Narrow the replacement to the minimal changed range for collab-friendly
	// cursor preservation on unaffected list items.
	const narrowed = narrowReplacementRange(
		tr.doc,
		rootListStart,
		rootListEnd,
		fragment,
		contentStartOffsets,
	);

	tr.replaceWith(narrowed.start, narrowed.end, narrowed.fragment);

	const { from, to } = computeSelectionOffsets({
		items,
		startIndex,
		endIndex,
		originalFrom: originalSelection.from,
		originalTo: originalSelection.to,
		contentStartOffsets: narrowed.adjustedContentStartOffsets,
		rootListStart: narrowed.start,
		docSize: tr.doc.content.size,
	});

	restoreSelection({ tr, originalSelection, from, to });
}
