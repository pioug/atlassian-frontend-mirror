import type { RowOrColumnMovedState } from './types';

export enum AnalyticPluginTypes {
  UpdateOverflowTriggerNameAction,
  UpdateRowOrColumnMovedAction,
  RemoveRowOrColumnMovedAction,
  RemoveOverFlowTriggerNameAction,
  UpdateRowOrColumnMovedAndOverflowTrigger,
}

export type UpdateRowOrColumnMovedAction = {
  type: AnalyticPluginTypes.UpdateRowOrColumnMovedAction;
  data: RowOrColumnMovedState;
};

export type RemoveRowOrColumnMovedAction = {
  type: AnalyticPluginTypes.RemoveRowOrColumnMovedAction;
  data: undefined;
};

export type AnalyticPluginAction =
  | UpdateRowOrColumnMovedAction
  | RemoveRowOrColumnMovedAction;
