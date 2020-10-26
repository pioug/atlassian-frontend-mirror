import { Selection, Transaction, TextSelection } from 'prosemirror-state';
import { Fragment, Slice, NodeRange, NodeType } from 'prosemirror-model';
import { isListItemNode, isListNode } from '../utils/node';
import { findFirstParentListItemNode } from '../utils/find';
import { normalizeListItemsSelection } from '../utils/selection';
import { GapCursorSelection } from '../../selection/gap-cursor-selection';

export const indentListItemsSelected = (tr: Transaction) => {
  const oldSelection = normalizeListItemsSelection({
    selection: tr.selection,
    doc: tr.doc,
  });
  const { $from, $to } = oldSelection;
  const range = calculateRange({ selection: oldSelection });
  if (!range) {
    return false;
  }

  const listItemsSelected = {
    from: findFirstParentListItemNode($from),
    to: findFirstParentListItemNode($to),
  };

  if (listItemsSelected.from == null || listItemsSelected.to == null) {
    return null;
  }

  const previousListItem = tr.doc.resolve(listItemsSelected.from.pos)
    .nodeBefore;
  if (!previousListItem || !isListItemNode(previousListItem)) {
    return null;
  }

  const listItemSelectedCommonParent = range.parent;
  const previousNestedList = isListNode(previousListItem.lastChild)
    ? previousListItem.lastChild
    : null;
  const listNodeType = previousNestedList
    ? previousNestedList.type
    : listItemSelectedCommonParent.type;
  const nestedList = listItemsSelected.to.node.lastChild;

  const nestedItemsOffset =
    nestedList && isListNode(nestedList) ? nestedList.nodeSize : 0;
  const from = listItemsSelected.from.pos;
  const to =
    listItemsSelected.to.pos +
    listItemsSelected.to.node.nodeSize -
    nestedItemsOffset;
  const [sliceSelected, nestedListItemsLeftover] = createIndentedListItemsSlice(
    {
      tr,
      listNodeType,
      range,
      from,
      to,
    },
  );
  const hasPreviousNestedList = Boolean(previousNestedList);
  const start = from - 1;
  tr.replaceRange(
    hasPreviousNestedList ? start - 1 : start,
    range.end,
    sliceSelected,
  );
  const leftoverContentPosition = tr.mapping.map(to) - 2;
  if (nestedListItemsLeftover.openStart === 0) {
    tr.insert(leftoverContentPosition, nestedListItemsLeftover.content);
  } else {
    tr.replace(
      leftoverContentPosition - nestedListItemsLeftover.openStart,
      leftoverContentPosition - nestedListItemsLeftover.openStart,
      nestedListItemsLeftover,
    );
  }
  const nextSelection = calculateNewSelection({
    oldSelection,
    tr,
    hasPreviousNestedList,
  });

  tr.setSelection(nextSelection);
};

type CalculateRange = (props: { selection: Selection }) => NodeRange | null;
const calculateRange: CalculateRange = ({ selection }) => {
  const { $from, $to } = selection;
  const range = $from.blockRange($to, isListNode);
  if (!range) {
    return null;
  }

  return range;
};

type CalculateNewSelectionProps = {
  oldSelection: Selection;
  tr: Transaction;
  hasPreviousNestedList: boolean;
};

const calculateNewSelection = ({
  tr,
  oldSelection,
  hasPreviousNestedList,
}: CalculateNewSelectionProps) => {
  const offset = hasPreviousNestedList ? 2 : 0;
  const { $from, $to } = oldSelection;
  if (oldSelection instanceof GapCursorSelection) {
    const nextSelectionFrom = tr.doc.resolve($from.pos - offset);
    return new GapCursorSelection(nextSelectionFrom, oldSelection.side);
  }

  const { $from: nextSelectionFrom } = Selection.near(
    tr.doc.resolve($from.pos - offset),
  );
  const { $to: nextSelectionTo } = Selection.near(
    tr.doc.resolve($to.pos - offset),
    -1,
  );
  return new TextSelection(nextSelectionFrom, nextSelectionTo);
};

type CreateIndentedListItemsSliceProps = {
  tr: Transaction;
  from: number;
  to: number;
  listNodeType: NodeType;
  range: NodeRange;
};
const createIndentedListItemsSlice = ({
  tr,
  from,
  to,
  listNodeType,
  range,
}: CreateIndentedListItemsSliceProps): [Slice, Slice] => {
  const listItemsSlice = tr.doc.slice(from, to - 2);
  const listFragment = Fragment.from(
    listNodeType.create(null, listItemsSlice.content),
  );

  const nonSelectedListItemsSlice = tr.doc.slice(to, range.end - 2);

  const openStart = tr.doc.slice(from - 1, range.end).openStart;
  const slice = new Slice(listFragment, openStart, 0);

  return [slice, nonSelectedListItemsSlice];
};
