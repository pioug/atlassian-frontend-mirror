import { Action } from 'redux';

import { isChangeAccountAction } from '../actions/changeAccount';
import { State } from '../domain';

export default function accountChange(state: State, action: Action): State {
  if (isChangeAccountAction(action)) {
    const { accountId, serviceName } = action;

    // remove loading state from view, as we only reload the recents collection when the popup is shown
    const isLoading = serviceName === 'upload' ? false : state.view.isLoading;

    return {
      ...state,
      view: {
        ...state.view,
        isLoading,
        service: {
          accountId,
          name: serviceName,
        },
        path: [],
        items: [],
      },
    };
  } else {
    return state;
  }
}
