import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';

import type { TableDirection } from '../../types';

import type { DropTargetType } from './consts';

export interface DragAndDropAction<T, D> {
  type: T;
  data: D;
}

export const DragAndDropActionType = {
  SET_DROP_TARGET: 'SET_DROP_TARGET',
  CLEAR_DROP_TARGET: 'CLEAR_DROP_TARGET',
  TOGGLE_DRAG_MENU: 'TOGGLE_DRAG_MENU',
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

export type DragAndDropToggleDragMenuAction = DragAndDropAction<
  typeof DragAndDropActionType.TOGGLE_DRAG_MENU,
  {
    isDragMenuOpen: boolean;
    direction: TableDirection;
    index: number;
    isKeyboardModeActive: boolean;
  }
>;

// NOTE: This should be a Union of all possible actions
export type DragAndDropPluginAction =
  | DragAndDropSetDropTargetAction
  | DragAndDropClearDropTargetAction
  | DragAndDropToggleDragMenuAction;
