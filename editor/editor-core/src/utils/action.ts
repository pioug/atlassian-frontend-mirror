import type { MediaPluginState } from '@atlaskit/editor-plugins/media/types';
import type { EditorState, PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

// TODO: ED-15663
// Please, do not copy or use this kind of code below
// @ts-ignore
const mediaPluginKey = {
	key: 'mediaPlugin$',
	getState: (state: EditorState) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return (state as any)['mediaPlugin$'];
	},
} as PluginKey;

export async function getEditorValueWithMedia(editorView: EditorView) {
	const mediaPluginState =
		editorView.state && (mediaPluginKey.getState(editorView.state) as MediaPluginState);

	if (mediaPluginState && mediaPluginState.waitForMediaUpload) {
		await mediaPluginState.waitForPendingTasks();
	}

	return editorView.state.doc;
}
