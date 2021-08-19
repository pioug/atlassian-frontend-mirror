import { MobileDimensionsAction, MobileDimensionsActionTypes } from './actions';
import { MobileDimensionsPluginState } from './types';

export default function (
  state: MobileDimensionsPluginState,
  action: MobileDimensionsAction,
): MobileDimensionsPluginState {
  switch (action.type) {
    case MobileDimensionsActionTypes.SET_KEYBOARD_HEIGHT:
      return {
        ...state,
        keyboardHeight: action.keyboardHeight,
      };

    case MobileDimensionsActionTypes.SET_WINDOW_HEIGHT:
      return {
        ...state,
        windowHeight: action.windowHeight,
      };
    case MobileDimensionsActionTypes.SET_MOBILE_PADDING_TOP:
      return {
        ...state,
        mobilePaddingTop: action.paddingTop,
      };
  }
  return state;
}
