import { Action } from 'redux';

export const DROPZONE_DRAG_OUT = 'DROPZONE_DRAG_OUT';

export interface DropzoneDragOutAction extends Action {
  readonly type: 'DROPZONE_DRAG_OUT';
  readonly fileCount: number;
}

export function isDropzoneDragOutAction(
  action: Action,
): action is DropzoneDragOutAction {
  return action.type === DROPZONE_DRAG_OUT;
}

export function dropzoneDragOut(fileCount: number): DropzoneDragOutAction {
  return {
    type: DROPZONE_DRAG_OUT,
    fileCount,
  };
}
