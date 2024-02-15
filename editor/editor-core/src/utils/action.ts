import type {
  OptionalPlugin,
  PublicPluginAPI,
} from '@atlaskit/editor-common/types';
import type { ContextPanelPlugin } from '@atlaskit/editor-plugins/context-panel';
import type { ExtensionPlugin } from '@atlaskit/editor-plugins/extension';
import type { MediaPluginState } from '@atlaskit/editor-plugins/media/types';
import type {
  EditorState,
  PluginKey,
} from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

// TODO: ED-15663
// Please, do not copy or use this kind of code below
// @ts-ignore
const mediaPluginKey = {
  key: 'mediaPlugin$',
  getState: (state: EditorState) => {
    return (state as any)['mediaPlugin$'];
  },
} as PluginKey;

export async function __temporaryFixForConfigPanel(
  editorView: EditorView,
  api: PublicPluginAPI<
    [OptionalPlugin<ExtensionPlugin>, OptionalPlugin<ContextPanelPlugin>]
  >,
) {
  const extensionPluginState = api?.extension?.sharedState.currentState();

  if (extensionPluginState && extensionPluginState.showContextPanel) {
    await new Promise<void>((resolve) => {
      api?.extension?.actions.forceAutoSave(
        api?.contextPanel?.actions.applyChange,
      )(resolve)(editorView.state, editorView.dispatch);
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
