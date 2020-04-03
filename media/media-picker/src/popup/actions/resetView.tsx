import { Action } from 'redux';

export const RESET_VIEW = 'RESET_VIEW';

export interface ResetViewAction extends Action {
  readonly type: 'RESET_VIEW';
}

export function isResetViewAction(action: Action): action is ResetViewAction {
  return action.type === RESET_VIEW;
}

export function resetView(): ResetViewAction {
  return {
    type: RESET_VIEW,
  };
}
