import { Action } from 'redux';

import { isResetViewAction } from '../actions/resetView';
import { State } from '../domain';

export default function resetView(state: State, action: Action): State {
  if (isResetViewAction(action)) {
    return {
      ...state,
      selectedItems: [],
      uploads: {},
    };
  } else {
    return state;
  }
}
