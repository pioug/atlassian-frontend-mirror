import type {
	EditorCommand,
	EditorContentMode,
	NextEditorPlugin,
} from '@atlaskit/editor-common/types';

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
