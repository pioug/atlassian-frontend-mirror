import type {
  Node,
  NodeType,
  ResolvedPos,
} from '@atlaskit/editor-prosemirror/model';
import type {
  EditorState,
  Selection,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { liftTarget } from '@atlaskit/editor-prosemirror/transform';
import {
  findParentNodeClosestToPos,
  hasParentNodeOfType,
} from '@atlaskit/editor-prosemirror/utils';

import { findFarthestParentNode } from '../../../utils';
import { stateKey } from './plugin-key';
import type { TaskItemData } from './types';
import { ACTIONS } from './types';

export const isInsideTaskOrDecisionItem = (state: EditorState) => {
  const { decisionItem, taskItem } = state.schema.nodes;
  return hasParentNodeOfType([decisionItem, taskItem])(state.selection);
};

export const isActionOrDecisionList = (node: Node) => {
  const { taskList, decisionList } = node.type.schema.nodes;
  return [taskList, decisionList].indexOf(node.type) > -1;
};

export const isActionOrDecisionItem = (node: Node) => {
  const { taskItem, decisionItem } = node.type.schema.nodes;
  return [taskItem, decisionItem].indexOf(node.type) > -1;
};

export const isInsideTask = (state: EditorState) => {
  const { taskItem } = state.schema.nodes;
  return hasParentNodeOfType([taskItem])(state.selection);
};

export const isInsideDecision = (state: EditorState) => {
  const { decisionItem } = state.schema.nodes;
  return hasParentNodeOfType([decisionItem])(state.selection);
};

export const isTable = (node?: Node | null): boolean => {
  if (!node) {
    return false;
  }
  const { table, tableHeader, tableCell, tableRow } = node.type.schema.nodes;
  return [table, tableHeader, tableCell, tableRow].includes(node.type);
};

/**
 * Creates a NodeRange around the given taskItem and the following
 * ("nested") taskList, if one exists.
 */
export const getBlockRange = ($from: ResolvedPos, $to: ResolvedPos) => {
  const { taskList } = $from.doc.type.schema.nodes;

  let end = $to.end();
  const $after = $to.doc.resolve(end + 1);
  const after = $after.nodeAfter;

  // ensure the node after is actually just a sibling
  // $to will be inside the text, so subtract one to get the taskItem it contains in
  if (after && after.type === taskList && $after.depth === $to.depth - 1) {
    // it was! include it in our blockRange
    end += after.nodeSize;
  }

  return $from.blockRange($to.doc.resolve(end));
};

/**
 * Finds the distance between the current $from and the root of the taskList.
 */
export const getCurrentIndentLevel = (selection: Selection) => {
  const { $from } = selection;
  const { taskList } = $from.doc.type.schema.nodes;

  const furthestParent = findFarthestParentNode(
    (node) => node.type === taskList,
  )($from);
  if (!furthestParent) {
    return null;
  }

  return $from.depth - furthestParent.depth;
};

/**
 * Finds the index of the current task item in relation to the closest taskList
 */
export const getTaskItemIndex = (state: EditorState) => {
  const $pos = state.selection.$from;
  const isTaskList = (node: Node | undefined) => node?.type.name === 'taskList';
  const itemAtPos = findParentNodeClosestToPos($pos, isTaskList);
  return $pos.index(itemAtPos ? itemAtPos.depth : undefined);
};

/**
 * Walk outwards from a position until we encounter the (inside) start of
 * the next node, or reach the end of the document.
 *
 * @param $startPos Position to start walking from.
 */
export const walkOut = ($startPos: ResolvedPos): ResolvedPos => {
  let $pos = $startPos;

  // invariant 1: don't walk past the end of the document
  // invariant 2: we haven't walked to the start of *any* node
  //              parentOffset includes textOffset.
  while ($pos.pos < $pos.doc.nodeSize - 2 && $pos.parentOffset > 0) {
    $pos = $pos.doc.resolve($pos.pos + 1);
  }

  return $pos;
};

/**
 * Finds the height of a tree-like structure, given any position inside it.
 *
 * Traverses from the top of the tree to all leaf nodes, and returns the length
 * of the longest path.
 *
 * This means you can use it with things like taskList, which
 * do not nest themselves inside taskItems but rather as adjacent children.
 *
 * @param $pos Any position inside the tree.
 * @param types The node types to consider traversable
 */
export const subtreeHeight = (
  $from: ResolvedPos,
  $to: ResolvedPos,
  types: NodeType[],
): number => {
  const root = findFarthestParentNode((node) => types.indexOf(node.type) > -1)(
    $from,
  );
  if (!root) {
    return -1;
  }

  // get the height between the root and the current position
  const distToParent = $from.depth - root.depth;

  // include any following taskList since nested lists appear
  // as siblings
  //
  // this is unlike regular bullet lists where the orderedList
  // appears as descendent of listItem
  const blockRange = getBlockRange($from, $to);
  if (!blockRange) {
    return -1;
  }

  // and get the max height from the current position to the
  // deepest leaf node
  let maxChildDepth = $from.depth;
  $from.doc.nodesBetween(
    blockRange.start,
    blockRange.end,
    (descendent, relPos, parent) => {
      maxChildDepth = Math.max($from.doc.resolve(relPos).depth, maxChildDepth);

      // keep descending down the tree if we can
      if (types.indexOf(descendent.type) > -1) {
        return true;
      }
    },
  );

  return distToParent + (maxChildDepth - $from.depth);
};

/**
 * Returns `true` if the taskItem or decisionItem has no text.
 */
export const isEmptyTaskDecision = (state: EditorState) => {
  const { selection, schema } = state;
  const { $from } = selection;
  const node = $from.node($from.depth);
  return (
    node &&
    (node.type === schema.nodes.taskItem ||
      node.type === schema.nodes.decisionItem) &&
    node.content.size === 0
  );
};

/**
 * Lifts a taskItem and any directly following taskList
 * (taskItem and its "nested children") out one level.
 *
 * @param tr Transaction to base steps on
 * @param $from Start of range you want to lift
 * @param $to End of range you want to lift (can be same as `$from`)
 */
export const liftBlock = (
  tr: Transaction,
  $from: ResolvedPos,
  $to: ResolvedPos,
): Transaction | null => {
  const blockRange = getBlockRange($from, $to);
  if (!blockRange) {
    return null;
  }

  // ensure we can actually lift
  const target = liftTarget(blockRange);
  if (typeof target !== 'number') {
    return null;
  }

  return tr.lift(blockRange, target).scrollIntoView();
};

export function getTaskItemDataAtPos(view: EditorView) {
  const { state } = view;
  const { selection, schema } = state;
  const { $from } = selection;
  const isInTaskItem = $from.node().type === schema.nodes.taskItem;

  // current selection has to be inside taskitem
  if (isInTaskItem) {
    const taskItemPos = $from.before();
    return {
      pos: taskItemPos,
      localId: $from.node().attrs.localId,
    };
  }
}

export function getAllTaskItemsDataInRootTaskList(view: EditorView) {
  const { state } = view;
  const { schema } = state;
  const $fromPos = state.selection.$from;
  const isInTaskItem = $fromPos.node().type === schema.nodes.taskItem;
  // if not inside task item then return undefined;
  if (!isInTaskItem) {
    return;
  }

  const { taskList, taskItem } = schema.nodes;
  const rootTaskListData = findFarthestParentNode(
    (node) => node.type === taskList,
  )($fromPos);
  if (rootTaskListData) {
    const rootTaskList = rootTaskListData.node;
    const rootTaskListStartPos = rootTaskListData.start;
    const allTaskItems: Array<{ node: Node; pos: number; index: number }> = [];
    rootTaskList.descendants((node, pos, parent, index) => {
      if (node.type === taskItem) {
        allTaskItems.push({
          node,
          pos: pos + rootTaskListStartPos,
          index,
        });
      }
    });
    return allTaskItems;
  }
}

export function getCurrentTaskItemIndex(
  view: EditorView,
  allTaskItems: Array<{ node: Node; pos: number; index: number }>,
) {
  const { state } = view;
  const $fromPos = state.selection.$from;
  const allTaskItemNodes = allTaskItems.map((nodeData) => nodeData.node);
  const currentTaskItem = $fromPos.node($fromPos.depth);
  const currentTaskItemIndex = allTaskItemNodes.indexOf(currentTaskItem);
  return currentTaskItemIndex;
}

export function getTaskItemDataToFocus(
  view: EditorView,
  direction: 'next' | 'previous',
) {
  const allTaskItems = getAllTaskItemsDataInRootTaskList(view);
  // if not inside task item then allTaskItems will be undefined;
  if (!allTaskItems) {
    return;
  }
  const currentTaskItemIndex = getCurrentTaskItemIndex(view, allTaskItems);
  if (
    direction === 'next'
      ? currentTaskItemIndex === allTaskItems.length - 1
      : currentTaskItemIndex === 0
  ) {
    // checkbox of first or last task item is already focused based on direction.
    return;
  }

  const indexOfTaskItemToFocus =
    direction === 'next' ? currentTaskItemIndex + 1 : currentTaskItemIndex - 1;
  const taskItemToFocus = allTaskItems[indexOfTaskItemToFocus];
  return {
    pos: taskItemToFocus.pos,
    localId: taskItemToFocus.node.attrs.localId,
  };
}

export function focusCheckboxAndUpdateSelection(
  view: EditorView,
  taskItemData: TaskItemData,
) {
  const { pos, localId } = taskItemData;
  const { state, dispatch } = view;
  const { doc, tr } = state;
  tr.setSelection(new TextSelection(doc.resolve(pos + 1)));
  tr.setMeta(stateKey, {
    action: ACTIONS.FOCUS_BY_LOCALID,
    data: localId,
  });
  dispatch(tr);
}

export function removeCheckboxFocus(view: EditorView) {
  const { state, dispatch } = view;
  const { tr } = state;

  view.focus();

  dispatch(
    tr.setMeta(stateKey, {
      action: ACTIONS.FOCUS_BY_LOCALID,
    }),
  );
}
