import type { EditorView } from 'prosemirror-view';
import type { EditorPlugin } from '../types/editor-plugin';
import type { InsertNodeAPI } from './types';
import { handleInsertContent } from './insert-content-handlers';

import { addAnalytics } from '../plugins/analytics';

type Props = {
  // To avoid race conditions issues during the insertion phase,
  // we need a fresh EditorView pointer to get the current EditorState
  getEditorView: () => EditorView | undefined | null;

  // Editor Archicture allows dynamic plugins on runtime.
  // So, we need to get a the current list to search for the insertion handlers
  getEditorPlugins: () => EditorPlugin[];
};

export const createInsertNodeAPI = ({
  getEditorView,
  getEditorPlugins,
}: Props): InsertNodeAPI => {
  return {
    insert: ({ node, options }) => {
      const editorView = getEditorView();
      if (!editorView) {
        return false;
      }

      const {
        state: { tr },
      } = editorView;

      const editorPlugins = getEditorPlugins();

      handleInsertContent({ editorPlugins, node, options })(tr);

      // TODO: ED-14676 This approach to send analytics should be temporary only for the table work
      if (options.analyticsPayload) {
        addAnalytics(editorView.state, tr, options.analyticsPayload);
      }

      editorView.dispatch(tr);

      return true;
    },

    // TODO: ED-14676 - Implement the append behavior
    // append: ({ node, options }) => (tr) => {
    //   const editorPlugins = getEditorPlugins();
    //   return insertContent({ editorPlugins, node, options })(tr);
    // },
  };
};
