import type { TasksAndDecisionsPluginOptions } from '@atlaskit/editor-plugin-tasks-and-decisions';
import type { TaskDecisionProvider } from '@atlaskit/task-decision/types';

interface Props {
	options: {
		hasEditPermission: boolean | undefined;
		hasRequestedEditPermission: boolean | undefined;
		requestToEditContent: (() => void) | undefined;
	};
	providers: {
		taskDecisionProvider: Promise<TaskDecisionProvider> | undefined;
	};
}

export function tasksAndDecisionsPluginOptions({
	options,
	providers,
}: Props): TasksAndDecisionsPluginOptions {
	return {
		allowNestedTasks: true,
		consumeTabs: true,
		useLongPressSelection: false,
		taskDecisionProvider: providers.taskDecisionProvider,
		hasEditPermission: options.hasEditPermission,
		requestToEditContent: options.requestToEditContent,
		hasRequestedEditPermission: options.hasRequestedEditPermission,
		allowBlockTaskItem: true,
	};
}
