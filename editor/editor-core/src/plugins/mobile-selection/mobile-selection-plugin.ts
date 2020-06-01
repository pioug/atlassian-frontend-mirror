import { Plugin, PluginKey } from 'prosemirror-state';
import { EditorPlugin } from '../../types';
import { Dispatch } from '../../event-dispatcher';
import { findSelectionRef } from './find-selection-ref';
import { SelectionData } from './types';

export const selectionPluginKey = new PluginKey('mobile-selection');

export const createProseMirrorPlugin = (dispatch: Dispatch): Plugin => {
  return new Plugin({
    view: editorView => {
      const domAtPos = editorView.domAtPos.bind(editorView);
      return {
        update: (view, previousState) => {
          if (
            previousState.doc.eq(view.state.doc) &&
            previousState.selection.eq(view.state.selection)
          ) {
            return;
          }

          const selection = view.state.selection.toJSON() as SelectionData;
          const ref = findSelectionRef(view.state.selection, domAtPos);

          if (!ref) {
            return;
          }

          const { top, left } = ref.getBoundingClientRect();

          dispatch(selectionPluginKey, {
            rect: { top: Math.round(top), left: Math.round(left) },
            selection,
          });
        },
      };
    },
  });
};

export const mobileSelectionPlugin = (): EditorPlugin => ({
  name: 'mobileSelection',
  pmPlugins: () => [
    {
      name: 'mobileSelection',
      plugin: ({ dispatch }) => createProseMirrorPlugin(dispatch),
    },
  ],
});
