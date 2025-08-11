import type {
	EditorAppearance,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { LimitedModePlugin } from '@atlaskit/editor-plugin-limited-mode';

export type CodeBidiWarningPluginOptions = {
	appearance?: EditorAppearance;
};

export type CodeBidiWarningPlugin = NextEditorPlugin<
	'codeBidiWarning',
	{
		dependencies: [OptionalPlugin<LimitedModePlugin>];
		pluginConfiguration: CodeBidiWarningPluginOptions | undefined;
	}
>;
