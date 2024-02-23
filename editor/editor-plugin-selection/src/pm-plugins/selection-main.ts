import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import {
  NodeSelection,
  TextSelection,
} from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { SelectionActionTypes } from '../actions';
import { createPluginState, getPluginState } from '../plugin-factory';
import type { SelectionPluginOptions, SelectionPluginState } from '../types';
import { selectionPluginKey } from '../types';
import {
  getAllSelectionAnalyticsPayload,
  getCellSelectionAnalyticsPayload,
  getDecorations,
  getNodeSelectionAnalyticsPayload,
  getRangeSelectionAnalyticsPayload,
  shouldRecalcDecorations,
} from '../utils';

import { onCreateSelectionBetween } from './events/create-selection-between';
import { createOnKeydown } from './events/keydown';

export const getInitialState = (state: EditorState): SelectionPluginState => ({
  decorationSet: getDecorations(state.tr),
  selection: state.selection,
});

export const createPlugin = (
  dispatch: Dispatch,
  dispatchAnalyticsEvent: DispatchAnalyticsEvent,
  options: SelectionPluginOptions = {},
) => {
  return new SafePlugin({
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
      createSelectionBetween: onCreateSelectionBetween,
      decorations(state) {
        return getPluginState(state).decorationSet;
      },

      handleDOMEvents: {
        keydown: createOnKeydown({ __livePage: options.__livePage }),
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
      },
    },
  });
};
