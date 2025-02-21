import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { IndentationPlugin } from '@atlaskit/editor-plugin-indentation';
import type { ListPlugin } from '@atlaskit/editor-plugin-list';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';
import type { SelectionToolbarPlugin } from '@atlaskit/editor-plugin-selection-toolbar';
import type { TasksAndDecisionsPlugin } from '@atlaskit/editor-plugin-tasks-and-decisions';

type Config = {
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
];

export type ToolbarListsIndentationPlugin = NextEditorPlugin<
	'toolbarListsIndentation',
	{
		pluginConfiguration: Config;
		dependencies: ToolbarListsIndentationPluginDependencies;
	}
>;
