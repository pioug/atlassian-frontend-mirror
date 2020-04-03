import { Action } from 'redux';

import { ServiceName } from '../domain';
export const CHANGE_ACCOUNT = 'CHANGE_ACCOUNT';

export interface ChangeAccountAction extends Action {
  readonly type: 'CHANGE_ACCOUNT';
  readonly serviceName: ServiceName;
  readonly accountId: string;
}

export function isChangeAccountAction(
  action: Action,
): action is ChangeAccountAction {
  return action.type === CHANGE_ACCOUNT;
}

export function changeAccount(
  serviceName: ServiceName,
  accountId: string,
): ChangeAccountAction {
  return {
    type: CHANGE_ACCOUNT,
    serviceName,
    accountId,
  };
}
