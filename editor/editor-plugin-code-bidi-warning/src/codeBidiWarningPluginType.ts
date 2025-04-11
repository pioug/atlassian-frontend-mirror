import type { EditorAppearance, NextEditorPlugin } from '@atlaskit/editor-common/types';

export type CodeBidiWarningPluginOptions = {
	appearance?: EditorAppearance;
};

export type CodeBidiWarningPlugin = NextEditorPlugin<
	'codeBidiWarning',
	{
		pluginConfiguration: CodeBidiWarningPluginOptions | undefined;
	}
>;
