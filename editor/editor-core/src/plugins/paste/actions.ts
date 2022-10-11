export enum PastePluginActionTypes {
  START_TRACKING_PASTED_MACRO_POSITIONS = 'START_TRACKING_PASTED_MACRO_POSITIONS',
  STOP_TRACKING_PASTED_MACRO_POSITIONS = 'STOP_TRACKING_PASTED_MACRO_POSITIONS',
}

export interface StartTrackingPastedMacroPositions {
  type: PastePluginActionTypes.START_TRACKING_PASTED_MACRO_POSITIONS;
  pastedMacroPositions: {
    [key: string]: number;
  };
}

export interface StopTrackingPastedMacroPositions {
  type: PastePluginActionTypes.STOP_TRACKING_PASTED_MACRO_POSITIONS;
  pastedMacroPositionKeys: string[];
}

export type PastePluginAction =
  | StartTrackingPastedMacroPositions
  | StopTrackingPastedMacroPositions;
