import {
  EditorState,
  Plugin,
  NodeSelection,
  TextSelection,
} from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import { browser } from '@atlaskit/editor-common';

import { Dispatch } from '../../../event-dispatcher';
import { DispatchAnalyticsEvent } from '../../analytics';

import { createPluginState, getPluginState } from '../plugin-factory';
import {
  selectionPluginKey,
  SelectionPluginOptions,
  SelectionPluginState,
} from '../types';
import {
  getDecorations,
  shouldRecalcDecorations,
  getNodeSelectionAnalyticsPayload,
  getRangeSelectionAnalyticsPayload,
  getAllSelectionAnalyticsPayload,
  getCellSelectionAnalyticsPayload,
} from '../utils';
import { SelectionActionTypes } from '../actions';

export const getInitialState = (state: EditorState): SelectionPluginState => ({
  decorationSet: getDecorations(state.tr),
  selection: state.selection,
});

export const createPlugin = (
  dispatch: Dispatch,
  dispatchAnalyticsEvent: DispatchAnalyticsEvent,
  options: SelectionPluginOptions = {},
) => {
  return new Plugin({
    key: selectionPluginKey,
    state: createPluginState(dispatch, getInitialState),
    view: () => ({
      update: (editorView, oldEditorState) => {
        const { state } = editorView;

        if (
          !shouldRecalcDecorations({ oldEditorState, newEditorState: state })
        ) {
          return;
        }

        const analyticsPayload =
          getNodeSelectionAnalyticsPayload(state.selection) ||
          getAllSelectionAnalyticsPayload(state.selection) ||
          // We handle all range/cell selections except click and drag here, which is
          // handled in mouseup handler below
          (!(editorView as EditorView & { mouseDown: any | null }).mouseDown &&
            (getRangeSelectionAnalyticsPayload(state.selection, state.doc) ||
              getCellSelectionAnalyticsPayload(state)));

        // We have to use dispatchAnalyticsEvent over any of the analytics plugin helpers
        // as there were several issues caused by the fact that adding analytics through
        // the plugin adds a new step to the transaction
        // This causes prosemirror to run through some different code paths, eg. attempting
        // to map selection
        if (analyticsPayload) {
          dispatchAnalyticsEvent(analyticsPayload);
        }
      },
    }),

    appendTransaction(_transactions, oldEditorState, newEditorState) {
      if (!shouldRecalcDecorations({ oldEditorState, newEditorState })) {
        return;
      }

      const { tr } = newEditorState;
      tr.setMeta(selectionPluginKey, {
        type: SelectionActionTypes.SET_DECORATIONS,
        selection: tr.selection,
        decorationSet: getDecorations(tr),
      });

      return tr;
    },

    filterTransaction(tr, state) {
      // Prevent single click selecting atom nodes on mobile (we want to select with long press gesture instead)
      if (
        options.useLongPressSelection &&
        tr.selectionSet &&
        tr.selection instanceof NodeSelection &&
        !tr.getMeta(selectionPluginKey)
      ) {
        return false;
      }

      // Prevent prosemirror's mutation observer overriding a node selection with a text selection
      // for exact same range - this was cause of being unable to change dates in collab:
      // https://product-fabric.atlassian.net/browse/ED-10645
      if (
        state.selection instanceof NodeSelection &&
        tr.selection instanceof TextSelection &&
        state.selection.from === tr.selection.from &&
        state.selection.to === tr.selection.to
      ) {
        return false;
      }

      return true;
    },

    props: {
      decorations(state) {
        return getPluginState(state).decorationSet;
      },

      handleDOMEvents: {
        // We only want to fire analytics for a click and drag range/cell selection when
        // the user has finished, otherwise we will get an event almost every time they move
        // their mouse which is too much
        mouseup: (editorView: EditorView, event: Event) => {
          const mouseEvent = event as MouseEvent;
          if (!mouseEvent.shiftKey) {
            const analyticsPayload =
              getRangeSelectionAnalyticsPayload(
                editorView.state.selection,
                editorView.state.doc,
              ) || getCellSelectionAnalyticsPayload(editorView.state);
            if (analyticsPayload) {
              dispatchAnalyticsEvent(analyticsPayload);
            }
          }
          return false;
        },
        keydown: (editorView: EditorView, event: Event) => {
          // Firefox bugfix to bypass issue with editing text adjacent to a DOM node with
          // contenteditable="false". (See https://product-fabric.atlassian.net/browse/ED-9452)
          // On keypress, if the head of cursor selection touches a node with contenteditable="false",
          // we temporarily remove the attribute, wait one tick, then restore it with its original value.
          if (browser.gecko) {
            const node = editorView.nodeDOM(editorView.state.selection.head);
            if (
              node instanceof HTMLElement &&
              node.getAttribute('contenteditable') === 'false'
            ) {
              node.removeAttribute('contenteditable');
              requestAnimationFrame(() => {
                node.setAttribute('contenteditable', 'false');
              });
            }
          }
          return false;
        },
      },
    },
  });
};
