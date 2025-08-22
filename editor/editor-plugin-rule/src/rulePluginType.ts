import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';

import type { insertHorizontalRule } from './pm-plugins/commands';

type RulePluginDependencies = [OptionalPlugin<AnalyticsPlugin>];

export type RulePlugin = NextEditorPlugin<
	'rule',
	{
		actions: {
			insertHorizontalRule: ReturnType<typeof insertHorizontalRule>;
		};
		dependencies: RulePluginDependencies;
		pluginConfiguration: undefined;
	}
>;
