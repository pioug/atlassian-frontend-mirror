import type { PastePluginState as State } from './types';
import type { PastePluginAction as Action } from './actions';
import { PastePluginActionTypes as ActionTypes } from './actions';

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionTypes.START_TRACKING_PASTED_MACRO_POSITIONS: {
      return {
        ...state,
        pastedMacroPositions: {
          ...state.pastedMacroPositions,
          ...action.pastedMacroPositions,
        },
      };
    }
    case ActionTypes.STOP_TRACKING_PASTED_MACRO_POSITIONS: {
      const filteredMacroPositions = Object.fromEntries(
        Object.entries(state.pastedMacroPositions).filter(
          ([key]) => !action.pastedMacroPositionKeys.includes(key),
        ),
      );
      return { ...state, pastedMacroPositions: filteredMacroPositions };
    }
    case ActionTypes.ON_PASTE: {
      return { ...state, lastContentPasted: action.contentPasted };
    }
    default:
      return state;
  }
};
