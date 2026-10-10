import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags/featureFlagsPluginType';
import type { IndentationPlugin } from '@atlaskit/editor-plugin-indentation/indentationPluginType';
import type { InteractionPlugin } from '@atlaskit/editor-plugin-interaction/interaction-plugin-type';
import type { ListPlugin } from '@atlaskit/editor-plugin-list/list-plugin-type';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar/primary-toolbar-plugin-type';
import type { SelectionToolbarPlugin } from '@atlaskit/editor-plugin-selection-toolbar/selection-toolbar-plugin-type';
import type { TasksAndDecisionsPlugin } from '@atlaskit/editor-plugin-tasks-and-decisions/tasks-and-decisions-plugin-type';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar/toolbar-plugin-type';
import type { UserPreferencesPlugin } from '@atlaskit/editor-plugin-user-preferences/user-preferences-plugin-type';

export type ToolbarListsIndentationPluginOptions = {
	allowHeadingAndParagraphIndentation: boolean;
	showIndentationButtons: boolean;
};

export type ToolbarListsIndentationPluginDependencies = [
	OptionalPlugin<FeatureFlagsPlugin>,
	ListPlugin,
	OptionalPlugin<IndentationPlugin>,
	OptionalPlugin<TasksAndDecisionsPlugin>,
	OptionalPlugin<AnalyticsPlugin>,
	OptionalPlugin<PrimaryToolbarPlugin>,
	OptionalPlugin<SelectionToolbarPlugin>,
	OptionalPlugin<UserPreferencesPlugin>,
	OptionalPlugin<ToolbarPlugin>,
	OptionalPlugin<InteractionPlugin>,
];

export type ToolbarListsIndentationPlugin = NextEditorPlugin<
	'toolbarListsIndentation',
	{
		dependencies: ToolbarListsIndentationPluginDependencies;
		pluginConfiguration: ToolbarListsIndentationPluginOptions;
	}
>;
