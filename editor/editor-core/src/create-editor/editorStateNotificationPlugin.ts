import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

export const createEditorStateNotificationPlugin = (
	onEditorStateUpdated: (props: {
		oldEditorState: EditorState;
		newEditorState: EditorState;
	}) => void,
) =>
	new SafePlugin({
		view: () => {
			return {
				update: (view, oldEditorState) => {
					onEditorStateUpdated({ oldEditorState, newEditorState: view.state });
				},
			};
		},
	});
