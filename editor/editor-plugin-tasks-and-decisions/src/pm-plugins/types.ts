import type { TaskDecisionProvider } from '@atlaskit/task-decision/types';

export enum ACTIONS {
	SET_PROVIDER,
	FOCUS_BY_LOCALID,
}

export type TaskItemData = {
	pos: number;
	localId: string | null;
};

// actions

export type TaskDecisionSetProviderAction = {
	action: ACTIONS.SET_PROVIDER;
	data: TaskDecisionProvider;
};

export type TaskDecisionFocusByLocalIdAction = {
	action: ACTIONS.FOCUS_BY_LOCALID;
	data: string;
};

export type TaskDecisionPluginAction =
	| TaskDecisionSetProviderAction
	| TaskDecisionFocusByLocalIdAction;

// commands

export type TaskDecisionEditPermissionCommand = {
	hasEditPermission?: boolean;
	hasRequestedEditPermission?: boolean;
};

export type TaskDecisionPluginCommand = TaskDecisionEditPermissionCommand;
