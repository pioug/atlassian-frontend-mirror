import type { SelectionContext } from '@atlaskit/editor-common/types';
import type { Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import {
	getFragmentsFromSelection,
	getLocalIdsFromSelection,
} from '@atlaskit/editor-common/selection';

import { getPosFromRange, getStartPos, findParent } from '../steps';

type GetSelectionContextOptions = {
	doc?: PMNode;
	schema?: Schema;
};

export const getSelectionContext = ({
	doc,
	schema,
}: GetSelectionContextOptions): SelectionContext | null => {
	if (!doc || !schema) {
		return null;
	}

	const selection = document.getSelection();
	if (!selection || selection.type !== 'Range' || selection.rangeCount !== 1) {
		return null;
	}

	const range = selection.getRangeAt(0);
	if (range.collapsed) {
		return null;
	}

	const startNode = findParent(range.startContainer);
	const endNode = findParent(range.endContainer);
	if (!startNode || !endNode) {
		return null;
	}

	const startPos = getStartPos(startNode);
	const endPos = getStartPos(endNode);
	if (startPos === null || endPos === null) {
		return null;
	}

	const pos = getPosFromRange(range);
	if (!pos) {
		return null;
	}

	const from = Math.min(pos.from, pos.to);
	const to = Math.max(pos.from, pos.to);
	if (from === to) {
		return null;
	}

	let pmSelection: TextSelection;
	try {
		pmSelection = TextSelection.create(doc, from, to);
	} catch {
		return null;
	}

	const startIndex = from - startPos;
	const endIndex = to - endPos;
	if (startIndex < 0 || endIndex < 0) {
		return null;
	}

	const selectionFragment = getFragmentsFromSelection(pmSelection);
	const localIds = getLocalIdsFromSelection(pmSelection);

	return {
		localIds,
		selectionFragment,
		selectionMarkdown: null,
		startIndex,
		endIndex,
	};
};
