import { Action } from 'redux';

import { isHidePopupAction } from '../actions/hidePopup';
import { State } from '../domain';

export default function (state: State, action: Action): State {
  if (isHidePopupAction(action)) {
    return {
      ...state,
      view: {
        ...state.view,
        isVisible: false,
      },
    };
  } else {
    return state;
  }
}
