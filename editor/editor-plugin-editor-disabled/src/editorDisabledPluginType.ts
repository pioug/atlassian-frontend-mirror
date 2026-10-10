import type { EditorCommand } from '@atlaskit/editor-common/types/editor-command';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types/next-editor-plugin';

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
