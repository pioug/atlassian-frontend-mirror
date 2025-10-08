import type { EditorCommand, NextEditorPlugin } from '@atlaskit/editor-common/types';

export type EditorDisabledPluginState = { disabledByPlugin: boolean; editorDisabled: boolean };

export interface EditorDisabledPluginOptions {
	initialDisabledState?: boolean;
}

export type EditorDisabledPlugin = NextEditorPlugin<
	'editorDisabled',
	{
		commands: {
			toggleDisabled: (disabled: boolean) => EditorCommand;
		};
		pluginConfiguration: EditorDisabledPluginOptions | undefined;
		sharedState: Pick<EditorDisabledPluginState, 'editorDisabled'>;
	}
>;
