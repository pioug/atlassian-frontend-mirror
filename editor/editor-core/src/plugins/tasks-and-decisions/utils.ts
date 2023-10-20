import type {
  Node as PMNode,
  ResolvedPos,
} from '@atlaskit/editor-prosemirror/model';
import {
  NodeSelection,
  Selection,
  TextSelection,
} from '@atlaskit/editor-prosemirror/state';
import { transformSliceToDecisionList } from '@atlaskit/editor-common/transforms';

export { transformSliceToDecisionList };

function isTaskListNode(node: PMNode | null | undefined) {
  return Boolean(node && node.type && 'taskList' === node.type.name);
}

const resolvePositionToStartOfTaskItem = ($pos: ResolvedPos): ResolvedPos => {
  const fromRange = $pos.blockRange($pos, isTaskListNode);
  const fromPosition =
    fromRange && $pos.textOffset === 0 && fromRange.end - 1 === $pos.pos
      ? Selection.near($pos.doc.resolve(fromRange.end + 1), 1).$from
      : $pos;
  return fromPosition;
};

const resolvePositionToEndOfTaskItem = ($pos: ResolvedPos): ResolvedPos => {
  const toRange = $pos.blockRange($pos, isTaskListNode);
  const toPosition =
    toRange && $pos.textOffset === 0 && toRange.start + 1 === $pos.pos
      ? Selection.near($pos.doc.resolve(toRange.start - 1), -1).$to
      : $pos;

  return toPosition;
};

export const normalizeTaskItemsSelection = (
  selection: Selection,
): Selection => {
  if (selection.empty) {
    return selection;
  }

  const { $from, $to } = selection;

  if (selection instanceof NodeSelection) {
    const head = resolvePositionToStartOfTaskItem($from);
    return new TextSelection(head, head);
  }

  const head = resolvePositionToStartOfTaskItem($from);
  const anchor = resolvePositionToEndOfTaskItem($to);

  return new TextSelection(anchor, head);
};
