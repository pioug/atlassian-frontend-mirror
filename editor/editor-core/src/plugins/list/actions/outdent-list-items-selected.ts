import {
  Selection,
  Transaction,
  TextSelection,
  NodeSelection,
} from 'prosemirror-state';
import { NodeRange, Slice, Fragment, ResolvedPos } from 'prosemirror-model';
import {
  liftTarget,
  ReplaceAroundStep,
  ReplaceStep,
} from 'prosemirror-transform';
import {
  isListNode,
  isListItemNode,
  joinSiblingLists,
  JoinDirection,
} from '../utils/node';
import {
  findFirstParentListItemNode,
  findRootParentListNode,
} from '../utils/find';
import {
  normalizeListItemsSelection,
  createListNodeRange,
} from '../utils/selection';
import { GapCursorSelection } from '../../selection/gap-cursor-selection';

export const outdentListItemsSelected = (tr: Transaction) => {
  const originalSelection = tr.selection;
  const normalizedSelection = normalizeListItemsSelection({
    selection: tr.selection,
    doc: tr.doc,
  });

  const rootList = findRootParentListNode(normalizedSelection.$from);
  if (!rootList) {
    return;
  }

  const commonList = normalizedSelection.$from.blockRange(rootList, isListNode);

  if (!commonList) {
    return;
  }

  let hasNormalizedToPositionLiftedOut = false;
  let hasNormalizedFromPositionLiftedOut = false;
  const { from: oldFrom, to: oldTo } = normalizedSelection;
  const nodeRanges = splitRangeSelection(normalizedSelection);
  nodeRanges.forEach((range) => {
    const $from = tr.doc.resolve(tr.mapping.map(range.from));
    const $to = tr.doc.resolve(tr.mapping.map(range.to));
    const mappedRange = $from.blockRange($to, isListNode);

    if (!mappedRange) {
      return;
    }

    if (isListItemNode($from.node(mappedRange.depth - 1))) {
      outdentRangeToParentList({ tr, range: mappedRange });
    } else {
      extractListItemsRangeFromList({ tr, range: mappedRange });
      hasNormalizedToPositionLiftedOut =
        hasNormalizedToPositionLiftedOut ||
        (oldTo >= range.from && oldTo < range.to);
      hasNormalizedFromPositionLiftedOut =
        hasNormalizedFromPositionLiftedOut ||
        (oldFrom >= range.from && oldFrom < range.to);
    }
  });

  const hasCommonListMoved =
    commonList.start !== tr.mapping.map(commonList.start);

  const nextSelection = calculateNewSelection({
    originalSelection,
    normalizedSelection,
    tr,
    hasCommonListMoved,
    hasNormalizedToPositionLiftedOut,
    hasNormalizedFromPositionLiftedOut,
  });
  tr.setSelection(nextSelection);

  joinSiblingLists({ tr, direction: JoinDirection.RIGHT });
};

type CalculateNewSelectionProps = {
  originalSelection: Selection;
  normalizedSelection: Selection;
  tr: Transaction;
  hasCommonListMoved: boolean;
  hasNormalizedFromPositionLiftedOut: boolean;
  hasNormalizedToPositionLiftedOut: boolean;
};

const calculateNewSelection = ({
  tr,
  originalSelection,
  normalizedSelection,
  hasCommonListMoved,
  hasNormalizedToPositionLiftedOut,
  hasNormalizedFromPositionLiftedOut,
}: CalculateNewSelectionProps) => {
  const { $from, $to } = normalizedSelection;
  const isCursorSelection = normalizedSelection.empty;

  let from = tr.mapping.map($from.pos);
  let to = tr.mapping.map($to.pos);

  const LIST_STRUCTURE_CHANGED_OFFSET = 2;
  const isToFromSameListItem = $from.sameParent($to);
  if (hasNormalizedFromPositionLiftedOut) {
    const fromMapped = isToFromSameListItem ? $from.pos : from;
    from = hasNormalizedFromPositionLiftedOut ? $from.pos : fromMapped;
    from = hasCommonListMoved ? from - LIST_STRUCTURE_CHANGED_OFFSET : from;
    from = Math.max(from, 0);
  }

  if (hasNormalizedToPositionLiftedOut) {
    const toMapped = isToFromSameListItem ? $to.pos : to;
    to = hasNormalizedToPositionLiftedOut ? $to.pos : toMapped;
    to = hasCommonListMoved ? to - LIST_STRUCTURE_CHANGED_OFFSET : to;
    to = Math.min(to, tr.doc.nodeSize - 2);
  }

  if (normalizedSelection instanceof GapCursorSelection) {
    const nextSelectionFrom = tr.doc.resolve(from);
    return new GapCursorSelection(nextSelectionFrom, normalizedSelection.side);
  }

  if (originalSelection instanceof NodeSelection) {
    return NodeSelection.create(tr.doc, from);
  }

  if (isCursorSelection) {
    return TextSelection.between(tr.doc.resolve(to), tr.doc.resolve(to), -1);
  }

  return TextSelection.between(tr.doc.resolve(from), tr.doc.resolve(to), -1);
};

type ResolvedPosRange = Array<{
  from: number;
  to: number;
  depth: number;
}>;

const splitRangeSelection = (selection: Selection): ResolvedPosRange => {
  const commonListRange = createListNodeRange({
    selection,
  });

  if (!commonListRange) {
    return [];
  }

  const { $from, $to } = selection;

  if ($from.pos === $to.pos && $from.sameParent($to)) {
    return [
      {
        from: commonListRange.start,
        to: commonListRange.end,
        depth: commonListRange.depth,
      },
    ];
  }
  const lastListItem = findPreviousListItemSibling($from);

  if (!lastListItem) {
    return [];
  }

  const nodeRanges: ResolvedPosRange = [];
  const { doc } = $from;

  let previousListItem = findPreviousListItemSibling($to);
  while (
    previousListItem &&
    previousListItem.pos >= lastListItem.pos &&
    previousListItem.pos >= commonListRange.start
  ) {
    const node = doc.nodeAt(previousListItem.pos);
    if (!node || !isListItemNode(node)) {
      return [];
    }

    let offset = 0;

    if (node && node.lastChild && isListNode(node.lastChild)) {
      offset = node.lastChild.nodeSize;
    }

    const start = previousListItem.pos + 1;

    nodeRanges.push({
      from: start,
      to: doc.resolve(start).end() - offset,
      depth: previousListItem.depth,
    });

    previousListItem = findPreviousListItemSibling(previousListItem);
  }

  return nodeRanges;
};

type OutdentListRangeProps = {
  tr: Transaction;
  range: NodeRange;
};
const outdentRangeToParentList = ({ tr, range }: OutdentListRangeProps) => {
  const end = range.end;
  const endOfList = range.$to.end(range.depth);
  const { listItem } = tr.doc.type.schema.nodes;
  if (end < endOfList) {
    const slice = new Slice(
      Fragment.from(listItem.create(null, range.parent.copy())),
      1,
      0,
    );
    const step = new ReplaceAroundStep(
      end - 1,
      endOfList,
      end,
      endOfList,
      slice,
      1,
      true,
    );
    tr.step(step);
    range = new NodeRange(
      tr.doc.resolve(range.$from.pos),
      tr.doc.resolve(endOfList),
      range.depth,
    );
  }

  const target = liftTarget(range);

  if (target) {
    tr.lift(range, target);
  }
};

const extractListItemsRangeFromList = ({
  tr,
  range,
}: OutdentListRangeProps) => {
  const list = range.parent;
  const $start = tr.doc.resolve(range.start);

  const listStart = $start.start(range.depth);
  const listEnd = $start.end(range.depth);
  const isAtTop = listStart === range.start;
  const isAtBottom = listEnd === range.end;
  const isTheEntireList = isAtTop && isAtBottom;

  let listItemContent = isAtTop
    ? Fragment.empty
    : Fragment.from(list.copy(Fragment.empty));
  for (let i = range.startIndex; i < range.endIndex; i++) {
    listItemContent = listItemContent.append(list.child(i).content);
  }

  if (isAtTop) {
    for (let i = 0; i < listItemContent.childCount; i++) {
      const child = listItemContent.child(i);
      if (child && isListNode(child) && child.type !== list.type) {
        const newNestedList = list.type.create(null, child.content);
        listItemContent = listItemContent.replaceChild(i, newNestedList);
      }
    }
  }

  const nextListFragment = listItemContent.append(
    Fragment.from(list.copy(Fragment.empty)),
  );

  if (isTheEntireList) {
    const slice = new Slice(listItemContent, 0, 0);
    const step = new ReplaceStep($start.pos - 1, range.end + 1, slice, false);
    tr.step(step);
  } else if (isAtTop) {
    const slice = new Slice(nextListFragment, 0, 1);
    const step = new ReplaceStep($start.pos - 1, range.end, slice, false);
    tr.step(step);
  } else if (isAtBottom) {
    const slice = new Slice(listItemContent, 1, 0);
    const step = new ReplaceStep($start.pos, listEnd + 1, slice, false);
    tr.step(step);
  } else {
    const slice = new Slice(nextListFragment, 1, 1);
    const step = new ReplaceAroundStep(
      $start.pos,
      listEnd,
      range.end,
      listEnd,
      slice,
      slice.size,
      false,
    );

    tr.step(step);
  }
};

const findPreviousListItemSibling = ($pos: ResolvedPos) => {
  const doc = $pos.doc;
  const isPositionListItem = isListNode($pos.node());
  let listItemPosition = $pos;

  if (!isPositionListItem) {
    const listItem = findFirstParentListItemNode($pos);

    if (!listItem) {
      return null;
    }

    return doc.resolve(listItem.pos);
  }

  const resolved = doc.resolve(listItemPosition.pos);
  const foundPosition = Selection.findFrom(resolved, -1);

  if (!foundPosition) {
    return null;
  }

  const parentListItemNode = findFirstParentListItemNode(foundPosition.$from);

  if (!parentListItemNode) {
    return null;
  }

  return doc.resolve(parentListItemNode.pos);
};
