import { isListNode } from '@atlaskit/editor-common/utils';
import type { Slice as PMSlice, Schema } from '@atlaskit/editor-prosemirror/model';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import type { TextSelection, Transaction } from '@atlaskit/editor-prosemirror/state';
import { Selection } from '@atlaskit/editor-prosemirror/state';
import { ReplaceStep } from '@atlaskit/editor-prosemirror/transform';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';

import { isCursorSelectionAtTextStartOrEnd, isEmptyNode, isSelectionInsidePanel } from '../index';

import {
	insertSliceAtNodeEdge,
	insertSliceInsideOfPanelNodeSelected,
	insertSliceIntoEmptyNode,
	insertSliceIntoRangeSelectionInsideList,
} from './lists';

export function insertSliceForLists({
	tr,
	slice,
	schema,
}: {
	tr: Transaction;
	slice: PMSlice;
	schema: Schema;
}) {
	const {
		selection,
		selection: { $to, $from },
	} = tr;
	const { $cursor } = selection as TextSelection;
	const panelNode = isSelectionInsidePanel(selection);
	const selectionIsInsideList = $from.blockRange($to, isListNode);

	if (!$cursor && selectionIsInsideList) {
		return insertSliceIntoRangeSelectionInsideList({ tr, slice });
	}

	// if inside an empty panel, try and insert content inside it rather than replace it
	if (panelNode && isEmptyNode(panelNode) && $from.node() === $to.node()) {
		return insertSliceInsideOfPanelNodeSelected(panelNode)({
			tr,
			slice,
			schema,
		});
	}

	if (!$cursor || selectionIsInsideList) {
		return tr.replaceSelection(slice);
	}

	if (isEmptyNode(tr.doc.resolve($cursor.pos).node())) {
		return insertSliceIntoEmptyNode({ tr, slice });
	}

	// When pasting a single list item into an action or decision, we skip the special "insert at node edge"
	// logic so that prosemirror pastes the list's content into the action/decision, rather than
	// pasting a whole list node directly after the action/decision item. (But we still preserve the
	// existing "insert at" node edge" behaviour if dealing with a list with more than one item, so that
	// it still inserts whole list node after the action/decision item).
	const pastingIntoActionOrDecision = Boolean(
		findParentNodeOfType([schema.nodes.taskList, schema.nodes.decisionList])(selection),
	);
	const oneListItem =
		slice.content.childCount === 1 &&
		isListNode(slice.content.firstChild) &&
		slice.content.firstChild?.childCount === 1;

	if (
		!(pastingIntoActionOrDecision && oneListItem) &&
		isCursorSelectionAtTextStartOrEnd(selection)
	) {
		return insertSliceAtNodeEdge({ tr, slice });
	}

	tr.replaceSelection(slice);
}

export function insertSliceInsideBlockquote({ tr, slice }: { tr: Transaction; slice: PMSlice }) {
	//insert blockquote explicitly and set the selection in blockquote since replaceSelection will only insert the list
	const { schema } = tr.doc.type;
	tr.replaceSelection(new Slice(Fragment.from(schema.nodes.blockquote.createAndFill()), 0, 0));
	updateSelectionAfterReplace({ tr });
	tr.replaceSelection(slice);
}

export function updateSelectionAfterReplace({ tr }: { tr: Transaction }) {
	// ProseMirror doesn't give a proper way to tell us where something was inserted.
	// However, we can know "how" it inserted something.
	//
	// So, instead of weird depth calculations, we can use the step produced by the transform.
	// For instance:
	//    The `replaceStep.to and replaceStep.from`, tell us the real position
	//    where the content will be insert.
	//    Then, we can use the `tr.mapping.map` to the updated position after the replace operation

	const replaceStep = tr.steps[0];
	if (!(replaceStep instanceof ReplaceStep)) {
		return tr;
	}
	const nextPosition = tr.mapping.map(replaceStep.to);
	// The findFrom will make search for both: TextSelection and NodeSelections.
	const nextSelection = Selection.findFrom(
		tr.doc.resolve(Math.min(nextPosition, tr.doc.content.size)),
		-1,
	);

	if (nextSelection) {
		tr.setSelection(nextSelection);
	}
}

export function insertSliceForTaskInsideList({ tr, slice }: { tr: Transaction; slice: PMSlice }) {
	const { schema } = tr.doc.type;
	//To avoid the list being replaced with the tasklist, enclose the slice within a taskItem.
	const selectionBeforeReplace = tr.selection.from;
	tr.replaceSelection(new Slice(Fragment.from(schema.nodes.taskItem.createAndFill()), 0, 0));
	const nextSelection = Selection.near(tr.doc.resolve(selectionBeforeReplace + 1));
	tr.setSelection(nextSelection);
	tr.replaceSelection(slice);
}
