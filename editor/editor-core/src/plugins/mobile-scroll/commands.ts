import { MobileScrollActionTypes } from './actions';
import { createCommand } from './plugin-factory';

export const setKeyboardHeight = (keyboardHeight: number) =>
  createCommand({
    type: MobileScrollActionTypes.SET_KEYBOARD_HEIGHT,
    keyboardHeight,
  });

export const setHeightDiff = (heightDiff: number) =>
  createCommand({
    type: MobileScrollActionTypes.SET_HEIGHT_DIFF,
    heightDiff,
  });

export const setWindowHeight = (windowHeight: number) =>
  createCommand({
    type: MobileScrollActionTypes.SET_WINDOW_HEIGHT,
    windowHeight,
  });

export const setMobilePaddingTop = (paddingTop: number) =>
  createCommand({
    type: MobileScrollActionTypes.SET_MOBILE_PADDING_TOP,
    paddingTop,
  });
