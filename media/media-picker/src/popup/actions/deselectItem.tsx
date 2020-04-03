import { Action } from 'redux';

export const DESELECT_ITEM = 'DESELECT_ITEM';

export interface DeselectItemAction extends Action {
  readonly type: 'DESELECT_ITEM';
  readonly id: string;
}

export function isDeselectItemAction(
  action: Action,
): action is DeselectItemAction {
  return action.type === DESELECT_ITEM;
}

export function deselectItem(fileId: string): DeselectItemAction {
  return {
    type: DESELECT_ITEM,
    id: fileId,
  };
}
