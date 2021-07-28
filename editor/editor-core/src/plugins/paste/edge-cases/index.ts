import { Slice } from 'prosemirror-model';
import { TextSelection, Transaction } from 'prosemirror-state';
import {
  insertSliceIntoRangeSelectionInsideList,
  insertSliceInsideOfPanelNodeSelected,
  insertSliceAtNodeEdge,
  insertSliceIntoEmptyNode,
} from './lists';
import { isListNode } from '../../list/utils/node';
import {
  isSelectionInsidePanel,
  isEmptyNode,
  isCursorSelectionAtTextStartOrEnd,
} from '../util';

export function insertSliceForLists({
  tr,
  slice,
}: {
  tr: Transaction;
  slice: Slice;
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

  if (isCursorSelectionAtTextStartOrEnd(selection)) {
    return insertSliceAtNodeEdge({ tr, slice });
  }

  tr.replaceSelection(slice);
}
