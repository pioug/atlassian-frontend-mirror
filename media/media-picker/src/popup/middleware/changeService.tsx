import { Store, Dispatch, Action } from 'redux';

import { State, ServiceName, ServiceAccountWithType } from '../domain';
import { isChangeServiceAction } from '../actions/changeService';
import { changeAccount } from '../actions/changeAccount';
import { getConnectedRemoteAccounts } from '../actions/getConnectedRemoteAccounts';

const loggableServices: ServiceName[] = ['google', 'dropbox'];

export const changeService = (store: Store<State>) => (
  next: Dispatch<State>,
) => async (action: Action) => {
  if (isChangeServiceAction(action)) {
    const { serviceName } = action;
    const { accountId: existingAccountId } = store.getState().view.service;

    if (loggableServices.indexOf(serviceName) !== -1) {
      store.dispatch(getConnectedRemoteAccounts());
    }

    const firstAccount = (await store.getState().accounts).find(
      (account: ServiceAccountWithType) => account.type === action.serviceName,
    );
    const accountId =
      existingAccountId || (firstAccount ? firstAccount.id : '');

    store.dispatch(changeAccount(serviceName, accountId));
  }

  return next(action);
};
