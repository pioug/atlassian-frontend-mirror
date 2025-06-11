import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

export type EditorDisabledPluginState = { editorDisabled: boolean };

export interface EditorDisabledPluginOptions {
	initialDisabledState?: boolean;
}

export type EditorDisabledPlugin = NextEditorPlugin<
	'editorDisabled',
	{
		sharedState: EditorDisabledPluginState;
		pluginConfiguration: EditorDisabledPluginOptions | undefined;
	}
>;
