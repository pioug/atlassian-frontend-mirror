import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

export type EditorDisabledPluginState = { editorDisabled: boolean };

export type EditorDisabledPlugin = NextEditorPlugin<
	'editorDisabled',
	{ sharedState: EditorDisabledPluginState }
>;
