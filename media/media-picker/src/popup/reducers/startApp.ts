import { Action } from 'redux';

import { isStartAppAction } from '../actions/startApp';
import { State } from '../domain';

export default function (state: State, action: Action): State {
  if (isStartAppAction(action)) {
    return {
      ...state,
      onCancelUpload: action.payload.onCancelUpload,
    };
  } else {
    return state;
  }
}
