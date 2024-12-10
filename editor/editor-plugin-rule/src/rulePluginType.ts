import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';

import type { insertHorizontalRule } from './pm-plugins/commands';

export type RulePlugin = NextEditorPlugin<
	'rule',
	{
		pluginConfiguration: undefined;
		dependencies: [OptionalPlugin<AnalyticsPlugin>];
		actions: {
			insertHorizontalRule: ReturnType<typeof insertHorizontalRule>;
		};
	}
>;
