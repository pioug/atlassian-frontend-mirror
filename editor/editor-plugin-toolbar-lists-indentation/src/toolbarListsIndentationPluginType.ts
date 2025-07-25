import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { IndentationPlugin } from '@atlaskit/editor-plugin-indentation';
import type { ListPlugin } from '@atlaskit/editor-plugin-list';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';
import type { SelectionToolbarPlugin } from '@atlaskit/editor-plugin-selection-toolbar';
import type { TasksAndDecisionsPlugin } from '@atlaskit/editor-plugin-tasks-and-decisions';
import type { UserPreferencesPlugin } from '@atlaskit/editor-plugin-user-preferences';

export type ToolbarListsIndentationPluginOptions = {
	showIndentationButtons: boolean;
	allowHeadingAndParagraphIndentation: boolean;
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
];

export type ToolbarListsIndentationPlugin = NextEditorPlugin<
	'toolbarListsIndentation',
	{
		pluginConfiguration: ToolbarListsIndentationPluginOptions;
		dependencies: ToolbarListsIndentationPluginDependencies;
	}
>;
