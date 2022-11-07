import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { EditorState, NodeSelection, TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import { Dispatch } from '../../../event-dispatcher';
import { DispatchAnalyticsEvent } from '../../analytics';

import { SelectionActionTypes } from '../actions';
import { createPluginState, getPluginState } from '../plugin-factory';
import {
  selectionPluginKey,
  SelectionPluginOptions,
  SelectionPluginState,
} from '../types';
import {
  getAllSelectionAnalyticsPayload,
  getCellSelectionAnalyticsPayload,
  getDecorations,
  getNodeSelectionAnalyticsPayload,
  getRangeSelectionAnalyticsPayload,
  shouldRecalcDecorations,
} from '../utils';

export const getInitialState = (state: EditorState): SelectionPluginState => ({
  decorationSet: getDecorations(state.tr),
  selection: state.selection,
});

const toggleContentEditable = (node: ChildNode, root: boolean = false) => {
  if (
    root ||
    (node as HTMLElement).getAttribute('contenteditable') === 'true'
  ) {
    const wasTrue =
      (node as HTMLElement).getAttribute('contenteditable') === 'true';
    (node as HTMLElement).setAttribute('contenteditable', 'false');
    requestAnimationFrame(() => {
      if (wasTrue) {
        (node as HTMLElement).setAttribute('contenteditable', 'true');
      } else {
        (node as HTMLElement).removeAttribute('contenteditable');
      }
    });
  }

  // any children with contenteditable = true block selection from proceeding
  const children = Array.from((node as HTMLElement).children);
  children.forEach((child) => toggleContentEditable(child));
};

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
          // Bugfix for block ReactNodeViews like table and extension
          // They could not be selected with Shift + ArrowDown/ArrowUp
          // Fixed when contenteditable = false, but then you couldn't edit their contents
          // Therefore, briefly set contenteditable=false to allow the selection through, then set it back to true
          if (
            event instanceof KeyboardEvent &&
            event.shiftKey &&
            (event.key === 'ArrowDown' || event.key === 'ArrowUp')
          ) {
            const { state } = editorView;
            // If current depth is on the top most level, skip that
            if (state.selection.$head.depth <= 0) {
              return false;
            }

            let pos;
            if (event.key === 'ArrowDown') {
              pos = state.selection.$head.after();
            } else {
              pos = Math.max(state.selection.$head.before() - 1, 0);
              // block extensions only take up one position, dont need to get before()
              if (!editorView.nodeDOM(pos)) {
                pos = state.doc.resolve(pos).before();
              }
            }
            const node = editorView.nodeDOM(pos);

            if (
              node instanceof HTMLDivElement &&
              node.className.includes('View-content-wrap') // class added by ReactNodeView
            ) {
              toggleContentEditable(node, true);
            }
          }
          return false;
        },
      },
    },
  });
};
