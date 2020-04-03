import { Action } from 'redux';

export const SHOW_POPUP = 'SHOW_POPUP';

export interface ShowPopupAction extends Action {
  readonly type: 'SHOW_POPUP';
}

export function isShowPopupAction(action: Action): action is ShowPopupAction {
  return action.type === SHOW_POPUP;
}

export function showPopup(): ShowPopupAction {
  return {
    type: SHOW_POPUP,
  };
}
