import type {
  Node as PMNode,
  ResolvedPos,
  Schema,
} from '@atlaskit/editor-prosemirror/model';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import {
  NodeSelection,
  Selection,
  TextSelection,
} from '@atlaskit/editor-prosemirror/state';

// If slice is decisionItem, wrap it inside a decisionList. This prevents an
// additional newline from being pasted along with the selected decision item.
export const transformSliceToDecisionList = (
  slice: Slice,
  schema: Schema,
): Slice => {
  const node = slice.content.firstChild;
  if (
    slice.content.childCount === 1 &&
    node &&
    node.type.name === 'decisionItem'
  ) {
    const decisionListWrapperNode = schema.nodes.decisionList.create({}, node);
    return new Slice(
      Fragment.from(decisionListWrapperNode),
      slice.openStart,
      slice.openEnd,
    );
  }
  return slice;
};

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
