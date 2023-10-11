import type { DropTargetType } from './consts';

export interface DragAndDropAction<T, D> {
  type: T;
  data: D;
}

export const DragAndDropActionType = {
  SET_DROP_TARGET: 'SET_DROP_TARGET',
  CLEAR_DROP_TARGET: 'CLEAR_DROP_TARGET',
} as const;

export type DragAndDropSetDropTargetAction = DragAndDropAction<
  typeof DragAndDropActionType.SET_DROP_TARGET,
  {
    type: DropTargetType;
    index: number;
  }
>;

export type DragAndDropClearDropTargetAction = DragAndDropAction<
  typeof DragAndDropActionType.CLEAR_DROP_TARGET,
  undefined
>;

// NOTE: This should be a Union of all possible actions
export type DragAndDropPluginAction =
  | DragAndDropSetDropTargetAction
  | DragAndDropClearDropTargetAction;
