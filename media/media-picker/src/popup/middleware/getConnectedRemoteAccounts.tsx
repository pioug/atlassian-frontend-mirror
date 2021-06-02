import { Action, Store, Dispatch } from 'redux';

import { updateServiceList } from '../actions/updateServiceList';
import { Fetcher } from '../tools/fetcher/fetcher';
import { State } from '../domain';
import {
  isGetConnectedRemoteAccountsAction,
  connectedRemoteAccountsFailed,
} from '../actions/getConnectedRemoteAccounts';

export const getConnectedRemoteAccounts = (fetcher: Fetcher) => (
  store: Store<State>,
) => (next: Dispatch<Action>) => (action: Action) => {
  if (isGetConnectedRemoteAccountsAction(action)) {
    const { userMediaClient } = store.getState();

    const servicesList = userMediaClient.config
      .authProvider()
      .then((auth) => fetcher.getServiceList(auth))
      .catch(() => {
        store.dispatch(connectedRemoteAccountsFailed());

        return [];
      });

    store.dispatch(updateServiceList(servicesList));
  }

  return next(action);
};
