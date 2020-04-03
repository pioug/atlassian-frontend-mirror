import { MiddlewareAPI, Dispatch, Action } from 'redux';

import { isChangeAccountAction } from '../actions/changeAccount';
import { changeCloudAccountFolder } from '../actions/changeCloudAccountFolder';
import { State, isRemoteCloudAccount } from '../domain';

export default (store: MiddlewareAPI<State>) => (next: Dispatch<State>) => (
  action: Action,
) => {
  if (isChangeAccountAction(action)) {
    const { serviceName, accountId } = action;

    if (isRemoteCloudAccount(serviceName) && accountId !== '') {
      store.dispatch(changeCloudAccountFolder(serviceName, accountId, []));
    }
  }

  return next(action);
};
