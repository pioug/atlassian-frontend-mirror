import { EditorState, Transaction } from 'prosemirror-state';
import { isListItemNode, isListNode } from '@atlaskit/editor-common/utils';
import { getListItemAttributes } from './selection';
import {
  RestartListsAttributesForListOutdented,
  CommonListAnalyticsAttributes,
} from '@atlaskit/editor-common/analytics';

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

export const RESTART_LISTS_ANALYTICS_KEY = 'restartListsAnalytics';

export const getRestartListsAttributes = (
  tr: Transaction,
): RestartListsAttributesForListOutdented =>
  tr.getMeta(RESTART_LISTS_ANALYTICS_KEY) ?? {};

export const storeRestartListsAttributes = (
  tr: Transaction,
  attributes: RestartListsAttributesForListOutdented,
): void => {
  const meta = getRestartListsAttributes(tr);
  tr.setMeta(RESTART_LISTS_ANALYTICS_KEY, {
    ...meta,
    ...attributes,
  });
};
