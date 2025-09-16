import type React from 'react';

import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { PluginKey } from '@atlaskit/editor-prosemirror/state';

export type LimitedModePluginState = {
	documentSizeBreachesThreshold: boolean;
};

export type LimitedModePlugin = NextEditorPlugin<
	'limitedMode',
	{
		pluginConfiguration: LimitedModePluginOptions | undefined;
		sharedState: {
			enabled: boolean;
			limitedModePluginKey: PluginKey<LimitedModePluginState>;
		};
	}
>;

export type LimitedModePluginOptions = {
	contentId?: string;
	showFlag?: (props: { close: string; description: React.ReactNode; title: string }) => void;
};
