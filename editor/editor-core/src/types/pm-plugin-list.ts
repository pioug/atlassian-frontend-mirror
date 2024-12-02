import type { PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import type { EditorConfig } from './editor-config';

export type PMPluginCreateConfig = PMPluginFactoryParams & {
	editorConfig: EditorConfig;
	onEditorStateUpdated:
		| ((props: { newEditorState: EditorState; oldEditorState: EditorState }) => void)
		| undefined;
};
