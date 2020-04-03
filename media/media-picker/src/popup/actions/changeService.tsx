import { Action } from 'redux';
import { ServiceName } from '../domain';

export const CHANGE_SERVICE = 'SERVICE_CHANGE';

export interface ChangeServiceAction extends Action {
  readonly type: 'SERVICE_CHANGE';
  readonly serviceName: ServiceName;
}

export function isChangeServiceAction(
  action: Action,
): action is ChangeServiceAction {
  return action.type === CHANGE_SERVICE;
}

export function changeService(serviceName: ServiceName): ChangeServiceAction {
  return {
    type: CHANGE_SERVICE,
    serviceName,
  };
}
