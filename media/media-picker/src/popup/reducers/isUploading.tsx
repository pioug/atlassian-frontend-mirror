import { Action } from 'redux';

import { isStartImportAction } from '../actions/startImport';
import { isResetViewAction } from '../actions/resetView';
import { isHidePopupAction } from '../actions/hidePopup';
import { State } from '../domain';

export function isUploading(state = false, action: Action) {
  if (isStartImportAction(action)) {
    return true;
  } else if (isResetViewAction(action)) {
    return false;
  } else {
    return state;
  }
}

export function isCancelling(state = false, action: Action) {
  if (isHidePopupAction(action)) {
    return true;
  } else if (isResetViewAction(action)) {
    return false;
  } else {
    return state;
  }
}

export default function(state: State, action: Action): State {
  const nextState = { ...state, view: { ...state.view } };
  let hasChanged = false;

  nextState.view.isUploading = isUploading(state.view.isUploading, action);
  if (nextState.view.isUploading !== state.view.isUploading) {
    hasChanged = true;
  }

  nextState.view.isCancelling = isCancelling(state.view.isCancelling, action);
  if (nextState.view.isCancelling !== state.view.isCancelling) {
    hasChanged = true;
  }

  return hasChanged ? nextState : state;
}

// this would be nicer:
// import {combineReducers} from 'redux';
// export default combineReducers({
//   isUploading,
//   isCancelling
// });
