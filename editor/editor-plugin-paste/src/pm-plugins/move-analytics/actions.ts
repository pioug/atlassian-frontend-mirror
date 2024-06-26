import type { ContentMoved } from './types';

export enum MoveAnalyticPluginTypes {
	UpdateMovedAction,
	RemoveMovedAction,
}

export type UpdateMovedAction = {
	type: MoveAnalyticPluginTypes.UpdateMovedAction;
	data: ContentMoved;
};

export type RemoveMovedAction = {
	type: MoveAnalyticPluginTypes.RemoveMovedAction;
	data: undefined;
};

export type MoveAnalyticsPluginAction = UpdateMovedAction | RemoveMovedAction;
