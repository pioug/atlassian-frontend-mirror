import type { Slice, Schema } from '@atlaskit/editor-prosemirror/model';
import type {
  TextSelection,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import {
  insertSliceIntoRangeSelectionInsideList,
  insertSliceInsideOfPanelNodeSelected,
  insertSliceAtNodeEdge,
  insertSliceIntoEmptyNode,
} from './lists';
import { isListNode } from '@atlaskit/editor-common/utils';

import {
  isSelectionInsidePanel,
  isEmptyNode,
  isCursorSelectionAtTextStartOrEnd,
} from '../util';

export function insertSliceForLists({
  tr,
  slice,
  schema,
}: {
  tr: Transaction;
  slice: Slice;
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
    return insertSliceInsideOfPanelNodeSelected(panelNode)({ tr, slice });
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
    findParentNodeOfType([schema.nodes.taskList, schema.nodes.decisionList])(
      selection,
    ),
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
