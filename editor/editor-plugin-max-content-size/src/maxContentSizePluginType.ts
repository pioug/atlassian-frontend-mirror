import type { NextEditorPlugin } from '@atlaskit/editor-common/types/next-editor-plugin';

export type MaxContentSizePluginState = { maxContentSizeReached: boolean };
export type MaxContentSizePlugin = NextEditorPlugin<
	'maxContentSize',
	{
		pluginConfiguration: number | undefined;
		sharedState: MaxContentSizePluginState | undefined;
	}
>;
