import { Action } from 'redux';
import { isShowPopupAction } from '../actions/showPopup';
import { State } from '../domain';

export default function (state: State, action: Action): State {
  if (isShowPopupAction(action)) {
    return {
      ...state,
      view: {
        ...state.view,
        isVisible: true,
      },
    };
  } else {
    return state;
  }
}
