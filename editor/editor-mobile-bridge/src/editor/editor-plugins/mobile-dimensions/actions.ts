export enum MobileDimensionsActionTypes {
  SET_WINDOW_HEIGHT = 'SET_WINDOW_HEIGHT',
  SET_MOBILE_PADDING_TOP = 'SET_MOBILE_PADDING_TOP',
  SET_IS_EXPANDED = 'SET_IS_EXPANDED',
}

export interface SetMobilePaddingTop {
  type: MobileDimensionsActionTypes.SET_MOBILE_PADDING_TOP;
  paddingTop: number;
}

export interface SetWindowHeight {
  type: MobileDimensionsActionTypes.SET_WINDOW_HEIGHT;
  windowHeight: number;
}

export interface SetIsExpanded {
  type: MobileDimensionsActionTypes.SET_IS_EXPANDED;
  isExpanded: boolean;
}

export type MobileDimensionsAction =
  | SetWindowHeight
  | SetMobilePaddingTop
  | SetIsExpanded;
