import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { Command, NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';

import type { TextColorPluginConfig, TextColorPluginState } from './pm-plugins/main';

type Config = TextColorPluginConfig | boolean;

export type TextColorInputMethod = INPUT_METHOD.TOOLBAR | INPUT_METHOD.FLOATING_TB;

export type TextColorPlugin = NextEditorPlugin<
	'textColor',
	{
		pluginConfiguration: Config | undefined;
		dependencies: [OptionalPlugin<AnalyticsPlugin>, OptionalPlugin<PrimaryToolbarPlugin>];
		actions: {
			changeColor: (color: string, inputMethod?: TextColorInputMethod) => Command;
		};
		sharedState: TextColorPluginState | undefined;
	}
>;

export enum ToolbarType {
	PRIMARY = 'primaryToolbar',
	FLOATING = 'floatingToolbar',
}
