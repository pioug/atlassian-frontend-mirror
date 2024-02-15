import { MobileDimensionsActionTypes } from './actions';
import { createCommand } from './plugin-factory';

export const setWindowHeight = (windowHeight: number) =>
  createCommand({
    type: MobileDimensionsActionTypes.SET_WINDOW_HEIGHT,
    windowHeight,
  });

export const setMobilePaddingTop = (paddingTop: number) =>
  createCommand({
    type: MobileDimensionsActionTypes.SET_MOBILE_PADDING_TOP,
    paddingTop,
  });

export const setIsExpanded = (isExpanded: boolean) =>
  createCommand({
    type: MobileDimensionsActionTypes.SET_IS_EXPANDED,
    isExpanded,
  });
