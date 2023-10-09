import type { MediaLinkingActions } from './actions';
import { MediaLinkingActionsTypes } from './actions';
import type { MediaLinkingState } from './types';

export default (state: MediaLinkingState, action: MediaLinkingActions) => {
  switch (action.type) {
    case MediaLinkingActionsTypes.showToolbar: {
      return {
        ...state,
        visible: true,
      };
    }
    case MediaLinkingActionsTypes.setUrl: {
      return {
        ...state,
        editable: true,
        link: action.payload,
      };
    }
    case MediaLinkingActionsTypes.hideToolbar: {
      return {
        ...state,
        visible: false,
      };
    }
    case MediaLinkingActionsTypes.unlink: {
      return {
        ...state,
        link: '',
        visible: false,
        editable: false,
      };
    }
  }
  return state;
};
