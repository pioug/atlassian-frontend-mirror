import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import { CommonListAnalyticsAttributes } from '../analytics';
import { isListItemNode, isListNode } from '../utils';

import { getListItemAttributes } from './selection';

export const getCommonListAnalyticsAttributes = (
  state: EditorState,
): CommonListAnalyticsAttributes => {
  const {
    selection: { $from, $to },
  } = state;
  const fromAttrs = getListItemAttributes($from);
  const toAttrs = getListItemAttributes($to);

  return {
    itemIndexAtSelectionStart: fromAttrs.itemIndex,
    itemIndexAtSelectionEnd: toAttrs.itemIndex,
    indentLevelAtSelectionStart: fromAttrs.indentLevel,
    indentLevelAtSelectionEnd: toAttrs.indentLevel,
    itemsInSelection: countListItemsInSelection(state),
  };
};

export const countListItemsInSelection = (state: EditorState) => {
  const { from, to } = state.selection;
  if (from === to) {
    return 1;
  }
  let count = 0;
  const listSlice = state.doc.cut(from, to);
  listSlice.content.nodesBetween(
    0,
    listSlice.content.size,
    (node, pos, parent, index) => {
      if (
        parent &&
        isListItemNode(parent) &&
        !isListNode(node) &&
        index === 0
      ) {
        count++;
      }
    },
  );
  return count;
};
