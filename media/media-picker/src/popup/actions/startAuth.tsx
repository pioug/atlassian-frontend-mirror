import { Action } from 'redux';
import { ServiceName } from '../domain';

export const START_AUTH = 'AUTH_START';

export interface StartAuthAction extends Action {
  readonly type: 'AUTH_START';
  readonly serviceName: ServiceName;
}

export function isStartAuthAction(action: Action): action is StartAuthAction {
  return action.type === START_AUTH;
}

export function startAuth(serviceName: ServiceName): StartAuthAction {
  return {
    type: START_AUTH,
    serviceName,
  };
}
