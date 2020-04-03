import { Action } from 'redux';

export const GET_CONNECTED_REMOTE_ACCOUNTS = 'GET_CONNECTED_REMOTE_ACCOUNTS';
export const GET_CONNECTED_REMOTE_ACCOUNTS_FAILED =
  'GET_CONNECTED_REMOTE_ACCOUNTS_FAILED';

export interface GetConnectedRemoteAccountsAction extends Action {
  type: 'GET_CONNECTED_REMOTE_ACCOUNTS';
}

export const isGetConnectedRemoteAccountsAction = (
  action: Action,
): action is GetConnectedRemoteAccountsAction => {
  return action.type === GET_CONNECTED_REMOTE_ACCOUNTS;
};

export const getConnectedRemoteAccounts = (): GetConnectedRemoteAccountsAction => {
  return {
    type: GET_CONNECTED_REMOTE_ACCOUNTS,
  };
};

export interface GetConnectedRemoteAccountsActionFailed extends Action {
  type: 'GET_CONNECTED_REMOTE_ACCOUNTS_FAILED';
}

export const connectedRemoteAccountsFailed = (): GetConnectedRemoteAccountsActionFailed => {
  return {
    type: GET_CONNECTED_REMOTE_ACCOUNTS_FAILED,
  };
};

export function isConnectedRemoteAccountFailedAction(
  action: Action,
): action is GetConnectedRemoteAccountsActionFailed {
  return action.type === GET_CONNECTED_REMOTE_ACCOUNTS_FAILED;
}
