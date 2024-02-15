import type { MobileDimensionsAction } from './actions';
import { MobileDimensionsActionTypes } from './actions';
import type { MobileDimensionsPluginState } from './types';

export default function (
  state: MobileDimensionsPluginState,
  action: MobileDimensionsAction,
): MobileDimensionsPluginState {
  switch (action.type) {
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
    case MobileDimensionsActionTypes.SET_IS_EXPANDED:
      return {
        ...state,
        isExpanded: action.isExpanded,
      };
  }
  return state;
}
