import type { EditorAppearance } from '@atlaskit/editor-common/types/editor-appearance';
import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { LimitedModePlugin } from '@atlaskit/editor-plugin-limited-mode/limited-mode-plugin-type';

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
