import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { IndentationPlugin } from '@atlaskit/editor-plugin-indentation';
import type { InteractionPlugin } from '@atlaskit/editor-plugin-interaction';
import type { ListPlugin } from '@atlaskit/editor-plugin-list';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';
import type { SelectionToolbarPlugin } from '@atlaskit/editor-plugin-selection-toolbar';
import type { TasksAndDecisionsPlugin } from '@atlaskit/editor-plugin-tasks-and-decisions';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar';
import type { UserPreferencesPlugin } from '@atlaskit/editor-plugin-user-preferences';

export type ToolbarListsIndentationPluginOptions = {
	allowHeadingAndParagraphIndentation: boolean;
	showIndentationButtons: boolean;
};

/**
 * Minimal duck-typed slice of `@atlassian/editor-plugin-markdown-mode`'s
 * `MarkdownModePlugin` covering only the list/task source-view surface this
 * plugin uses. See `editor-plugin-text-formatting/textFormattingPluginType.ts`
 * for the rationale for not importing the real type.
 */
type _MarkdownModePluginStub = NextEditorPlugin<
	'markdownMode',
	{
		actions: {
			toggleSourceBulletList: () => boolean;
			toggleSourceOrderedList: () => boolean;
			toggleSourceTaskList: () => boolean;
		};
		sharedState:
			| {
					sourceBlockFormatState: { inCodeBlock: boolean } | null;
					sourceListFormatState: {
						inBulletList: boolean;
						inOrderedList: boolean;
						inTaskList: boolean;
					} | null;
					view: 'syntax' | 'split-view' | 'preview';
			  }
			| undefined;
	}
>;

export type ToolbarListsIndentationPluginDependencies = [
	OptionalPlugin<_MarkdownModePluginStub>,
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
