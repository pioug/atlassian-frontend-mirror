import type { RowOrColumnMovedState } from './types';

export enum AnalyticPluginTypes {
	UpdateOverflowTriggerNameAction,
	UpdateRowOrColumnMovedAction,
	RemoveRowOrColumnMovedAction,
	RemoveOverFlowTriggerNameAction,
	UpdateRowOrColumnMovedAndOverflowTrigger,
}

type UpdateRowOrColumnMovedAction = {
	data: RowOrColumnMovedState;
	type: AnalyticPluginTypes.UpdateRowOrColumnMovedAction;
};

type RemoveRowOrColumnMovedAction = {
	data: undefined;
	type: AnalyticPluginTypes.RemoveRowOrColumnMovedAction;
};

export type AnalyticPluginAction = UpdateRowOrColumnMovedAction | RemoveRowOrColumnMovedAction;
