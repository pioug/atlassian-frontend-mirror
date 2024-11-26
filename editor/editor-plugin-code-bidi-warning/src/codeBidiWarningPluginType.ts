import type { EditorAppearance, NextEditorPlugin } from '@atlaskit/editor-common/types';

type Config = {
	appearance?: EditorAppearance;
};

export type CodeBidiWarningPlugin = NextEditorPlugin<
	'codeBidiWarning',
	{
		pluginConfiguration: Config | undefined;
	}
>;
