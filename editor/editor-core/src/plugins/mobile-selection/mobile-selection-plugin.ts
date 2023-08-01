import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import type { Dispatch } from '../../event-dispatcher';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import { contentInSelection } from './content-in-selection';

export const selectionPluginKey = new PluginKey('mobile-selection');

export const createProseMirrorPlugin = (dispatch: Dispatch): SafePlugin => {
  return new SafePlugin({
    view: (editorView) => {
      const domAtPos = editorView.domAtPos.bind(editorView);
      return {
        update: (view, previousState) => {
          const {
            state,
            state: { selection, doc },
          } = view;

          if (
            previousState.doc.eq(doc) &&
            previousState.selection.eq(selection)
          ) {
            return;
          }

          const ref = findDomRefAtPos(
            selection.$anchor.pos,
            domAtPos,
          ) as HTMLElement;

          const { top, left } = ref.getBoundingClientRect();
          const { nodeTypes, markTypes } = contentInSelection(state);

          dispatch(selectionPluginKey, {
            rect: { top: Math.round(top), left: Math.round(left) },
            selection: state.selection.toJSON(),
            nodeTypes,
            markTypes,
          });
        },
      };
    },
  });
};

export const mobileSelectionPlugin: NextEditorPlugin<
  'mobileSelection'
> = () => ({
  name: 'mobileSelection',
  pmPlugins: () => [
    {
      name: 'mobileSelection',
      plugin: ({ dispatch }) => createProseMirrorPlugin(dispatch),
    },
  ],
});
