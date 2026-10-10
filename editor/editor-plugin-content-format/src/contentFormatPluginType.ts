import type { EditorContentMode } from '@atlaskit/editor-common/types/editor-appearance';
import type { EditorCommand } from '@atlaskit/editor-common/types/editor-command';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types/next-editor-plugin';

export type ContentFormatPluginOptions = {
	initialContentMode: EditorContentMode;
};

export type ContentFormatPluginState = {
	contentMode: EditorContentMode;
};

export type ContentFormatPlugin = NextEditorPlugin<
	'contentFormat',
	{
		commands: {
			updateContentMode: (mode: EditorContentMode) => EditorCommand;
		};
		dependencies: [];
		pluginConfiguration?: ContentFormatPluginOptions;
		sharedState: ContentFormatPluginState | null;
	}
>;
