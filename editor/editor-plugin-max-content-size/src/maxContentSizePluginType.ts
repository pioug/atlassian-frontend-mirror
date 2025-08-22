import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

export type MaxContentSizePluginState = { maxContentSizeReached: boolean };
export type MaxContentSizePlugin = NextEditorPlugin<
	'maxContentSize',
	{
		pluginConfiguration: number | undefined;
		sharedState: MaxContentSizePluginState | undefined;
	}
>;
