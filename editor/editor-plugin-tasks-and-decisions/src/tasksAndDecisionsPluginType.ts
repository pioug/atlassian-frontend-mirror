import type {
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { BlockMenuPlugin } from '@atlaskit/editor-plugin-block-menu';
import type { ContextIdentifierPlugin } from '@atlaskit/editor-plugin-context-identifier';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar';
import type { TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import type { TaskDecisionProvider } from '@atlaskit/task-decision/types';

import type { insertTaskDecisionCommand } from './pm-plugins/insert-commands';
import type { getIndentCommand, getUnindentCommand } from './pm-plugins/keymaps';
import type { TaskAndDecisionsSharedState, TasksAndDecisionsPluginOptions } from './types';

/**
 * Minimal duck-typed slice of `@atlassian/editor-plugin-markdown-mode`'s
 * `MarkdownModePlugin` covering only the task-list source-view surface this
 * plugin uses. See `editor-plugin-text-formatting/textFormattingPluginType.ts`
 * for the rationale for not importing the real type.
 */
type _MarkdownModePluginStub = NextEditorPlugin<
	'markdownMode',
	{
		actions: {
			toggleSourceTaskList: () => boolean;
		};
		sharedState:
			| {
					sourceBlockFormatState: { inCodeBlock: boolean } | null;
					sourceListFormatState: { inTaskList: boolean } | null;
					view: 'syntax' | 'split-view' | 'preview';
			  }
			| undefined;
	}
>;

export type TasksAndDecisionsPluginDependencies = [
	OptionalPlugin<TypeAheadPlugin>,
	OptionalPlugin<AnalyticsPlugin>,
	OptionalPlugin<ContextIdentifierPlugin>,
	OptionalPlugin<EditorViewModePlugin>,
	OptionalPlugin<BlockMenuPlugin>,
	OptionalPlugin<SelectionPlugin>,
	OptionalPlugin<ToolbarPlugin>,
	OptionalPlugin<_MarkdownModePluginStub>,
];

export type TasksAndDecisionsPlugin = NextEditorPlugin<
	'taskDecision',
	{
		actions: {
			indentTaskList: ReturnType<typeof getIndentCommand>;
			insertTaskDecision: ReturnType<typeof insertTaskDecisionCommand>;
			outdentTaskList: ReturnType<typeof getUnindentCommand>;
			setProvider: (provider: Promise<TaskDecisionProvider>) => Promise<boolean>;
		};
		commands: {
			toggleTaskList: (targetType?: 'orderedList' | 'bulletList' | 'paragraph') => EditorCommand;
			updateEditPermission: (hasEditPermission: boolean | undefined) => EditorCommand;
			updateHasRequestedEditPermission: (hasRequestedEditPermission: boolean) => EditorCommand;
		};
		dependencies: TasksAndDecisionsPluginDependencies;
		pluginConfiguration: TasksAndDecisionsPluginOptions | undefined;
		sharedState: TaskAndDecisionsSharedState | undefined;
	}
>;
