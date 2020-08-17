import { EditorState, Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Dispatch } from '../../event-dispatcher';
import { browser } from '@atlaskit/editor-common';
import { setDecorations } from './commands';
import { createPluginState, getPluginState } from './plugin-factory';
import {
  selectionPluginKey,
  SelectionPluginOptions,
  SelectionPluginState,
} from './types';
import {
  getDecorations,
  shouldRecalcDecorations,
  getNodeSelectionAnalyticsPayload,
  getRangeSelectionAnalyticsPayload,
  getAllSelectionAnalyticsPayload,
  getCellSelectionAnalyticsPayload,
} from './utils';
import { DispatchAnalyticsEvent } from '../analytics';

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
      update: editorView => {
        const { state, dispatch } = editorView;

        if (!shouldRecalcDecorations(getPluginState(state), state)) {
          return;
        }

        const analyticsPayload =
          getNodeSelectionAnalyticsPayload(state.selection) ||
          getAllSelectionAnalyticsPayload(state.selection) ||
          // We only handle range/cell selection from shift + arrow keys and shift + click here,
          // click and drag is handled in mouseup handler below
          ((editorView as EditorView & { shiftKey: boolean }).shiftKey &&
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

        setDecorations()(state, dispatch);
      },
    }),
    props: {
      decorations(state) {
        return getPluginState(state).decorationSet;
      },

      handleClick: options.useLongPressSelection ? () => true : undefined,

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
