import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { PluginKey } from '@atlaskit/editor-prosemirror/state';

export type LimitedModePluginState = {
	documentSizeBreachesThreshold: boolean;
};

export type LimitedModePlugin = NextEditorPlugin<
	'limitedMode',
	{
		sharedState: {
			enabled: boolean;
			limitedModePluginKey: PluginKey<LimitedModePluginState>;
		};
	}
>;
