import type {
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { ContextIdentifierPlugin } from '@atlaskit/editor-plugin-context-identifier';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import type { TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import type { TaskDecisionProvider } from '@atlaskit/task-decision/types';

import type { insertTaskDecisionCommand } from './pm-plugins/insert-commands';
import type { getIndentCommand, getUnindentCommand } from './pm-plugins/keymaps';
import type { TaskAndDecisionsSharedState, TasksAndDecisionsPluginOptions } from './types';

export type TasksAndDecisionsPluginDependencies = [
	OptionalPlugin<TypeAheadPlugin>,
	OptionalPlugin<AnalyticsPlugin>,
	OptionalPlugin<ContextIdentifierPlugin>,
	OptionalPlugin<EditorViewModePlugin>,
];

export type TasksAndDecisionsPlugin = NextEditorPlugin<
	'taskDecision',
	{
		pluginConfiguration: TasksAndDecisionsPluginOptions | undefined;
		sharedState: TaskAndDecisionsSharedState | undefined;
		dependencies: TasksAndDecisionsPluginDependencies;
		actions: {
			insertTaskDecision: ReturnType<typeof insertTaskDecisionCommand>;
			indentTaskList: ReturnType<typeof getIndentCommand>;
			outdentTaskList: ReturnType<typeof getUnindentCommand>;
			setProvider: (provider: Promise<TaskDecisionProvider>) => Promise<boolean>;
		};
		commands: {
			updateEditPermission: (hasEditPermission: boolean | undefined) => EditorCommand;
			updateHasRequestedEditPermission: (hasRequestedEditPermission: boolean) => EditorCommand;
		};
	}
>;
