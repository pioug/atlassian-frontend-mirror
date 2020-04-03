import { Action } from 'redux';

import { State } from '../domain';
import { isUpdatePopupUrlsAction } from '../actions/updatePopupUrls';

export default function updatePopupUrls(state: State, action: Action): State {
  if (isUpdatePopupUrlsAction(action)) {
    const { urls } = action;
    return {
      ...state,
      ...urls,
    };
  }

  return state;
}
