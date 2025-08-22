import type { ContentMoved } from './types';

export enum MoveAnalyticPluginTypes {
	UpdateMovedAction,
	RemoveMovedAction,
}

export type UpdateMovedAction = {
	data: ContentMoved;
	type: MoveAnalyticPluginTypes.UpdateMovedAction;
};

export type RemoveMovedAction = {
	data: undefined;
	type: MoveAnalyticPluginTypes.RemoveMovedAction;
};

export type MoveAnalyticsPluginAction = UpdateMovedAction | RemoveMovedAction;
