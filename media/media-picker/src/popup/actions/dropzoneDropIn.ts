import { Action } from 'redux';

export const DROPZONE_DROP_IN = 'DROPZONE_DROP_IN';

export interface DropzoneDropInAction extends Action {
  readonly type: 'DROPZONE_DROP_IN';
  readonly fileCount: number;
}

export function isDropzoneDropInAction(
  action: Action,
): action is DropzoneDropInAction {
  return action.type === DROPZONE_DROP_IN;
}

export function dropzoneDropIn(fileCount: number): DropzoneDropInAction {
  return {
    type: DROPZONE_DROP_IN,
    fileCount,
  };
}
