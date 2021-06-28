import { EditorState, Transaction, Selection } from 'prosemirror-state';
import type { EditorView } from 'prosemirror-view';

import { pluginKey as extensionPluginKey } from '../plugins/extension/plugin-key';
import type { ExtensionState } from '../plugins/extension/types';
import { forceAutoSave } from '../plugins/extension/commands';

import type { Command, CommandDispatch } from '../types/command';
import { stateKey as mediaPluginKey } from '../plugins/media/pm-plugins/plugin-key';
import type { MediaPluginState } from '../plugins/media/pm-plugins/types';

export async function __temporaryFixForConfigPanel(editorView: EditorView) {
  const extensionPluginState =
    editorView.state &&
    (extensionPluginKey.getState(editorView.state) as ExtensionState);

  if (extensionPluginState && extensionPluginState.showContextPanel) {
    await new Promise((resolve) => {
      forceAutoSave(resolve)(editorView.state, editorView.dispatch);
    });
  }
}

export async function getEditorValueWithMedia(editorView: EditorView) {
  const mediaPluginState =
    editorView.state &&
    (mediaPluginKey.getState(editorView.state) as MediaPluginState);

  if (mediaPluginState && mediaPluginState.waitForMediaUpload) {
    await mediaPluginState.waitForPendingTasks();
  }

  return editorView.state.doc;
}

/**
 * Iterates over the commands one after the other,
 * passes the tr through and dispatches the cumulated transaction
 */
export function cascadeCommands(cmds: Command[]): Command {
  return (state: EditorState, dispatch?: CommandDispatch) => {
    let { tr: baseTr } = state;
    let shouldDispatch = false;

    const onDispatchAction = (tr: Transaction) => {
      const selectionJSON = tr.selection.toJSON();
      baseTr.setSelection(Selection.fromJSON(baseTr.doc, selectionJSON));
      tr.steps.forEach((st) => {
        baseTr.step(st);
      });
      shouldDispatch = true;
    };

    cmds.forEach((cmd) => cmd(state, onDispatchAction));

    if (dispatch && shouldDispatch) {
      dispatch(baseTr);
      return true;
    }

    return false;
  };
}
