import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

export type MaxContentSizePluginState = { maxContentSizeReached: boolean };
export type MaxContentSizePlugin = NextEditorPlugin<
	'maxContentSize',
	{
		sharedState: MaxContentSizePluginState | undefined;
		pluginConfiguration: number | undefined;
	}
>;
