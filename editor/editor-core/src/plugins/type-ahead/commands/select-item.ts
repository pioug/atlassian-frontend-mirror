import { Fragment, Node } from 'prosemirror-model';
import { EditorState, NodeSelection, Selection } from 'prosemirror-state';
import { safeInsert } from 'prosemirror-utils';

import { analyticsService } from '../../../analytics';
import { Command } from '../../../types';
import {
  isChromeWithSelectionBug,
  normaliseNestedLayout,
} from '../../../utils';
import { ACTIONS } from '../pm-plugins/actions';
import { pluginKey } from '../pm-plugins/plugin-key';
import { SelectItemMode, TypeAheadHandler, TypeAheadItem } from '../types';
import { findTypeAheadQuery } from '../utils/find-query-mark';

import { dismissCommand } from './dismiss';

export const selectCurrentItem = (
  mode: SelectItemMode = 'selected',
): Command => (state, dispatch) => {
  const { active, currentIndex, items, typeAheadHandler } = pluginKey.getState(
    state,
  );

  if (!active || !typeAheadHandler) {
    return false;
  }

  if (!typeAheadHandler.selectItem || !items[currentIndex]) {
    return withTypeAheadQueryMarkPosition(state, (start, end) =>
      insertFallbackCommand(start, end)(state, dispatch),
    );
  }

  return selectItem(
    typeAheadHandler,
    items[currentIndex],
    mode,
  )(state, dispatch);
};

export const selectSingleItemOrDismiss = (
  mode: SelectItemMode = 'selected',
): Command => (state, dispatch) => {
  const { active, items, typeAheadHandler } = pluginKey.getState(state);

  if (!active || !typeAheadHandler || !typeAheadHandler.selectItem) {
    return false;
  }

  if (items.length === 1) {
    return selectItem(typeAheadHandler, items[0], mode)(state, dispatch);
  }

  if (!items || items.length === 0) {
    dismissCommand()(state, dispatch);
    return false;
  }

  return false;
};

export const selectByIndex = (index: number): Command => (state, dispatch) => {
  const { active, items, typeAheadHandler } = pluginKey.getState(state);

  if (
    !active ||
    !typeAheadHandler ||
    !typeAheadHandler.selectItem ||
    !items[index]
  ) {
    return false;
  }

  return selectItem(typeAheadHandler, items[index])(state, dispatch);
};

export const selectItem = (
  handler: TypeAheadHandler,
  item: TypeAheadItem,
  mode: SelectItemMode = 'selected',
): Command => (state, dispatch) => {
  return withTypeAheadQueryMarkPosition(state, (start, end) => {
    const insert = (
      maybeNode?: Node | Object | string | Fragment,
      opts: { selectInlineNode?: boolean } = {},
    ) => {
      let tr = state.tr;

      tr = tr
        .setMeta(pluginKey, { action: ACTIONS.SELECT_CURRENT })
        .replaceWith(start, end, Fragment.empty);

      if (!maybeNode) {
        return tr;
      }

      const isInputFragment = maybeNode instanceof Fragment;
      let node;
      try {
        node =
          maybeNode instanceof Node || isInputFragment
            ? maybeNode
            : typeof maybeNode === 'string'
            ? state.schema.text(maybeNode)
            : Node.fromJSON(state.schema, maybeNode);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        return tr;
      }

      if (node.isText) {
        tr = tr.replaceWith(start, start, node);

        /**
         *
         * Replacing a type ahead query mark with a block node.
         *
         */
      } else if (node.isBlock) {
        tr = safeInsert(normaliseNestedLayout(state, node))(tr);

        /**
         *
         * Replacing a type ahead query mark with an inline node.
         *
         */
      } else if (node.isInline || isInputFragment) {
        const fragment = isInputFragment
          ? node
          : Fragment.fromArray([node, state.schema.text(' ')]);

        tr = tr.replaceWith(start, start, fragment);

        // This problem affects Chrome v58+. See: https://github.com/ProseMirror/prosemirror/issues/710
        if (isChromeWithSelectionBug) {
          const selection = document.getSelection();
          if (selection) {
            selection.empty();
          }
        }

        if (opts.selectInlineNode) {
          // Select inserted node
          tr = tr.setSelection(NodeSelection.create(tr.doc, start));
        } else {
          // Placing cursor after node + space.
          tr = tr.setSelection(
            Selection.near(tr.doc.resolve(start + fragment.size)),
          );
        }
      }

      return tr;
    };

    analyticsService.trackEvent('atlassian.editor.typeahead.select', { mode });

    const tr = handler.selectItem(state, item, insert, { mode });

    if (tr === false) {
      return insertFallbackCommand(start, end)(state, dispatch);
    }

    if (dispatch) {
      dispatch(tr);
    }
    return true;
  });
};

export const insertFallbackCommand = (start: number, end: number): Command => (
  state,
  dispatch,
) => {
  const { query, trigger } = pluginKey.getState(state);
  const node = state.schema.text(trigger + query);

  if (dispatch) {
    dispatch(state.tr.replaceWith(start, end, node));
  }
  return true;
};

export const withTypeAheadQueryMarkPosition = (
  state: EditorState,
  cb: (start: number, end: number) => boolean,
) => {
  const queryMark = findTypeAheadQuery(state);

  if (!queryMark || queryMark.start === -1) {
    return false;
  }

  return cb(queryMark.start, queryMark.end);
};
