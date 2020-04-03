import { Action } from 'redux';

import { CancelUploadHandler } from '../domain';

export const START_APP = 'START_APP';

export interface StartAppActionPayload {
  readonly onCancelUpload: CancelUploadHandler;
}

export interface StartAppAction extends Action {
  readonly type: 'START_APP';
  readonly payload: StartAppActionPayload;
}

export function isStartAppAction(action: Action): action is StartAppAction {
  return action.type === START_APP;
}

export function startApp(payload: StartAppActionPayload): StartAppAction {
  return {
    type: START_APP,
    payload,
  };
}
