import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import { MAX_NESTED_LIST_INDENTATION } from '../../types';
import { findFirstParentListNode, findRootParentListNode } from '../utils/find';
import { buildReplacementFragment, flattenList, restoreSelection } from '../utils/list-indentation';

/**
 * Moves the selected list items n levels up (negative delta) or down (positive delta).
 */
export function moveSelectedListItems(tr: Transaction, delta: number): void {
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
		delta,
	});

	if (!result || result.maxDepth >= MAX_NESTED_LIST_INDENTATION) {
		return;
	}

	const { elements, startIndex, endIndex } = result;

	// Build replacement — handles both indent (all depths >= 0)
	// and outdent (some depths may be < 0, producing extracted paragraphs).
	const { fragment, contentStartOffsets } = buildReplacementFragment(elements, tr.doc.type.schema);
	if (fragment.size === 0) {
		return;
	}

	tr.replaceWith(rootListStart, rootListEnd, fragment);

	const fromContentStart = elements[startIndex].pos + 1;
	const toContentStart = elements[endIndex].pos + 1;
	const fromOffset = originalSelection.from - fromContentStart;
	const toOffset = originalSelection.to - toContentStart;

	const clamp = (pos: number) => Math.min(Math.max(0, pos), tr.doc.content.size);

	const from = clamp(rootListStart + contentStartOffsets[startIndex] + fromOffset);
	const to = clamp(rootListStart + contentStartOffsets[endIndex] + toOffset);

	// Restore selection using the positional offsets from the rebuild.
	restoreSelection({ tr, originalSelection, from, to });
}
