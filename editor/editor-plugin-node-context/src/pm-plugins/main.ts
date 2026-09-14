import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

export const nodeContextPluginKey: PluginKey = new PluginKey('nodeContextPlugin');

type CreatePluginOptions = {
	onEditorViewCreated: (editorView: EditorView) => void;
	onEditorViewDestroyed: (editorView: EditorView) => void;
};

export const createPlugin = ({
	onEditorViewCreated,
	onEditorViewDestroyed,
}: CreatePluginOptions): SafePlugin => {
	return new SafePlugin({
		key: nodeContextPluginKey,
		view(editorView) {
			onEditorViewCreated(editorView);

			return {
				destroy() {
					onEditorViewDestroyed(editorView);
				},
			};
		},
	});
};
