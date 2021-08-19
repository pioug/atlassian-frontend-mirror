export enum MobileDimensionsActionTypes {
  SET_KEYBOARD_HEIGHT = 'SET_KEYBOARD_HEIGHT',
  SET_WINDOW_HEIGHT = 'SET_WINDOW_HEIGHT',
  SET_MOBILE_PADDING_TOP = 'SET_MOBILE_PADDING_TOP',
}

export interface SetMobilePaddingTop {
  type: MobileDimensionsActionTypes.SET_MOBILE_PADDING_TOP;
  paddingTop: number;
}
export interface SetKeyboardHeight {
  type: MobileDimensionsActionTypes.SET_KEYBOARD_HEIGHT;
  keyboardHeight: number;
}

export interface SetWindowHeight {
  type: MobileDimensionsActionTypes.SET_WINDOW_HEIGHT;
  windowHeight: number;
}

export type MobileDimensionsAction =
  | SetKeyboardHeight
  | SetWindowHeight
  | SetMobilePaddingTop;
