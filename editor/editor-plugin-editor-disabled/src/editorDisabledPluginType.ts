import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

export type EditorDisabledPluginState = { editorDisabled: boolean };

export interface EditorDisabledPluginOptions {
	initialDisabledState?: boolean;
}

export type EditorDisabledPlugin = NextEditorPlugin<
	'editorDisabled',
	{
		pluginConfiguration: EditorDisabledPluginOptions | undefined;
		sharedState: EditorDisabledPluginState;
	}
>;
