import type { RowOrColumnMovedState } from './types';

export enum AnalyticPluginTypes {
	UpdateOverflowTriggerNameAction,
	UpdateRowOrColumnMovedAction,
	RemoveRowOrColumnMovedAction,
	RemoveOverFlowTriggerNameAction,
	UpdateRowOrColumnMovedAndOverflowTrigger,
}

type UpdateRowOrColumnMovedAction = {
	type: AnalyticPluginTypes.UpdateRowOrColumnMovedAction;
	data: RowOrColumnMovedState;
};

type RemoveRowOrColumnMovedAction = {
	type: AnalyticPluginTypes.RemoveRowOrColumnMovedAction;
	data: undefined;
};

export type AnalyticPluginAction = UpdateRowOrColumnMovedAction | RemoveRowOrColumnMovedAction;
