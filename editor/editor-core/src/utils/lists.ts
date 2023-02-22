import { Selection } from 'prosemirror-state';
import { findRootParentListNode } from '../plugins/list/utils/find';

export const doesSelectionWhichStartsOrEndsInListContainEntireList = (
  selection: Selection,
) => {
  const { $from, $to, from, to } = selection;
  const selectionParentListItemNodeResolvedPos =
    findRootParentListNode($from) || findRootParentListNode($to);

  const selectionParentListNode =
    selectionParentListItemNodeResolvedPos?.parent;

  if (!selectionParentListItemNodeResolvedPos || !selectionParentListNode) {
    return false;
  }

  const startOfEntireList =
    $from.pos < $to.pos
      ? selectionParentListItemNodeResolvedPos.pos + $from.depth - 1
      : selectionParentListItemNodeResolvedPos.pos + $to.depth - 1;
  const endOfEntireList =
    $from.pos < $to.pos
      ? selectionParentListItemNodeResolvedPos.pos +
        selectionParentListNode.nodeSize -
        $to.depth -
        1
      : selectionParentListItemNodeResolvedPos.pos +
        selectionParentListNode.nodeSize -
        $from.depth -
        1;

  if (!startOfEntireList || !endOfEntireList) {
    return false;
  }

  if (from < to) {
    return startOfEntireList >= $from.pos && endOfEntireList <= $to.pos;
  } else if (from > to) {
    return startOfEntireList >= $to.pos && endOfEntireList <= $from.pos;
  } else {
    return false;
  }
};
