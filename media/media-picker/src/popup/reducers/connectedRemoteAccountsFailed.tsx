import { State } from '../domain';
import { Action } from 'redux';
import { isConnectedRemoteAccountFailedAction } from '../actions/getConnectedRemoteAccounts';

export const connectedRemoteAccountsFailed = (
  state: State,
  action: Action,
): State => {
  if (isConnectedRemoteAccountFailedAction(action)) {
    return {
      ...state,
      view: {
        ...state.view,
        isLoading: false,
        hasError: true,
      },
    };
  } else {
    return state;
  }
};
