import type { EditorCommand } from '@atlaskit/editor-common/types/editor-command';
import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';
import type { BlockMenuPlugin } from '@atlaskit/editor-plugin-block-menu/blockMenuPluginType';
import type { ContextIdentifierPlugin } from '@atlaskit/editor-plugin-context-identifier/contextIdentifierPluginType';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode/editorViewmodePluginType';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection/selection-plugin-type';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar/toolbar-plugin-type';
import type { TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead/type-ahead-plugin-type';
import type { UiControlRegistryPlugin } from '@atlaskit/editor-plugin-ui-control-registry/ui-control-registry-plugin-type';
import type { TaskDecisionProvider } from '@atlaskit/task-decision/types';

import type { insertTaskDecisionCommand } from './pm-plugins/insert-commands';
import type { getIndentCommand, getUnindentCommand } from './pm-plugins/keymaps';
import type { TaskAndDecisionsSharedState, TasksAndDecisionsPluginOptions } from './types';

export type TasksAndDecisionsPluginDependencies = [
	OptionalPlugin<TypeAheadPlugin>,
	OptionalPlugin<AnalyticsPlugin>,
	OptionalPlugin<ContextIdentifierPlugin>,
	OptionalPlugin<EditorViewModePlugin>,
	OptionalPlugin<BlockMenuPlugin>,
	OptionalPlugin<SelectionPlugin>,
	OptionalPlugin<ToolbarPlugin>,
	OptionalPlugin<UiControlRegistryPlugin>,
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
