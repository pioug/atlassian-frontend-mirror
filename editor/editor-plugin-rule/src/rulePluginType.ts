import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { FloatingToolbarPlugin } from '@atlaskit/editor-plugin-floating-toolbar';
import type { UiControlRegistryPlugin } from '@atlaskit/editor-plugin-ui-control-registry';

import type { insertHorizontalRule } from './pm-plugins/commands';

type RulePluginDependencies = [
	OptionalPlugin<AnalyticsPlugin>,
	OptionalPlugin<UiControlRegistryPlugin>,
	OptionalPlugin<DecorationsPlugin>,
	OptionalPlugin<FloatingToolbarPlugin>,
];

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
