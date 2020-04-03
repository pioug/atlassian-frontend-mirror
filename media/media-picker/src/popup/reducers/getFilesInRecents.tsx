import { Action } from 'redux';
import {
  isGetFilesInRecentsAction,
  isGetFilesInRecentsFullfilledAction,
  isGetFilesInRecentsFailedAction,
} from '../actions/getFilesInRecents';
import { State } from '../domain';

export const getRecentFilesStarted = (state: State, action: Action): State => {
  if (isGetFilesInRecentsAction(action)) {
    return {
      ...state,
      view: {
        ...state.view,
        service: {
          name: 'upload',
          accountId: '',
        },
        path: [],
        hasError: false,
      },
    };
  } else {
    return state;
  }
};

export const getRecentFilesFullfilled = (
  state: State,
  action: Action,
): State => {
  if (isGetFilesInRecentsFullfilledAction(action)) {
    const { items } = action;

    return {
      ...state,
      view: {
        ...state.view,
        isLoading: false,
      },
      recents: {
        items,
      },
    };
  }

  return state;
};

export const getRecentFilesFailed = (state: State, action: Action): State => {
  if (isGetFilesInRecentsFailedAction(action)) {
    return {
      ...state,
      view: {
        ...state.view,
        hasError: true,
        isLoading: false,
      },
    };
  }

  return state;
};
