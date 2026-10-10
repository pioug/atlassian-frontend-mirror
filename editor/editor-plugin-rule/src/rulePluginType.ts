import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations/decorationsPluginType';
import type { FloatingToolbarPlugin } from '@atlaskit/editor-plugin-floating-toolbar/floatingToolbarPluginType';
import type { UiControlRegistryPlugin } from '@atlaskit/editor-plugin-ui-control-registry/ui-control-registry-plugin-type';

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
