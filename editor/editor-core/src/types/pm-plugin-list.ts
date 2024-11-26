import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import type { EditorConfig } from './editor-config';
import type { PMPluginFactoryParams } from './pm-plugin';

export type PMPluginCreateConfig = PMPluginFactoryParams & {
	editorConfig: EditorConfig;
	onEditorStateUpdated:
		| ((props: { newEditorState: EditorState; oldEditorState: EditorState }) => void)
		| undefined;
};
