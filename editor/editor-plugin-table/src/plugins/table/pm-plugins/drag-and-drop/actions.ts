import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';

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
    decorationSet: DecorationSet;
  }
>;

export type DragAndDropClearDropTargetAction = DragAndDropAction<
  typeof DragAndDropActionType.CLEAR_DROP_TARGET,
  {
    decorationSet: DecorationSet;
  }
>;

// NOTE: This should be a Union of all possible actions
export type DragAndDropPluginAction =
  | DragAndDropSetDropTargetAction
  | DragAndDropClearDropTargetAction;
