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
      /**
       * Focuses the editor.
       *
       * Calls the focus method of the `EditorView` and scrolls the
       * current selection into view.
       *
       * @returns (boolean) if the focus was successful
       */
      focus: () => boolean;
      /**
       * Blurs the editor.
       *
       * Calls blur on the editor DOM element.
       *
       * @returns (boolean) if the blur was successful
       */
      blur: () => boolean;
    };
  }
>;

/**
 * Core plugin that is always included in the preset.
 * Allows for executing `EditorCommand` and other core functionality.
 */
export const corePlugin: CorePlugin = ({ config }) => {
  return {
    name: 'core',
    actions: {
      execute: (command) => {
        const editorView = config?.getEditorView();
        if (!editorView || !command) {
          return false;
        }

        const { state, dispatch } = editorView;
        return editorCommandToPMCommand(command)(state, dispatch);
      },
      // Code copied from `EditorActions.focus()`
      focus: () => {
        const editorView = config?.getEditorView();

        if (!editorView || editorView.hasFocus()) {
          return false;
        }

        editorView.focus();
        editorView.dispatch(editorView.state.tr.scrollIntoView());
        return true;
      },
      // Code copied from `EditorActions.blur()`
      blur: () => {
        const editorView = config?.getEditorView();

        if (!editorView || !editorView.hasFocus()) {
          return false;
        }

        (editorView.dom as HTMLElement).blur();
        return true;
      },
    },
  };
};
