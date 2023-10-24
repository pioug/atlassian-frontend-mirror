import type { PastePluginAction as Action } from './actions';
import { PastePluginActionTypes as ActionTypes } from './actions';
import type { PasteOtionsPluginState as State } from './types';

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionTypes.SHOW_PASTE_OPTIONS: {
      return {
        ...state,
        showToolbar: true,
        highlightContent: false,
        isPlainText: action.data.isPlainText,
        plaintext: action.data.plaintext,
        selectedOption: action.data.selectedOption,
        richTextSlice: action.data.richTextSlice,
        pasteStartPos: action.data.pasteStartPos,
        pasteEndPos: action.data.pasteEndPos,
      };
    }

    case ActionTypes.HIDE_PASTE_OPTIONS: {
      return {
        ...state,
        highlightContent: false,
        showToolbar: false,
      };
    }

    case ActionTypes.HIGHLIGHT_CONTENT: {
      return {
        ...state,
        highlightContent: true,
      };
    }

    case ActionTypes.CHANGE_FORMAT: {
      return {
        ...state,
        highlightContent: true,
        selectedOption: action.data.selectedOption,
      };
    }

    default:
      return state;
  }
};
