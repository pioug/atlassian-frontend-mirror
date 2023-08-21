import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { EditorCommand, NextEditorPlugin } from '../types';

import { editorCommandToPMCommand } from './editor-commands';

export type CorePlugin = NextEditorPlugin<
  'core',
  {
    pluginConfiguration: {
      getEditorView: () => EditorView | undefined;
    };
    actions: {
      /**
       * Dispatches an EditorCommand to ProseMirror
       *
       * @param command A function (EditorCommand | undefined) that takes an object containing a `Transaction` and returns a `Transaction` if it
       * is successful or `null` if it shouldn't be dispatched.
       * @returns (boolean) if the command was successful in dispatching
       */
      execute: (command: EditorCommand | undefined) => boolean;
    };
  }
>;

export const corePlugin: CorePlugin = ({ getEditorView }) => {
  return {
    name: 'core',
    actions: {
      execute: (command) => {
        const editorView = getEditorView();
        if (!editorView || !command) {
          return false;
        }

        const { state, dispatch } = editorView;
        return editorCommandToPMCommand(command)(state, dispatch);
      },
    },
  };
};
