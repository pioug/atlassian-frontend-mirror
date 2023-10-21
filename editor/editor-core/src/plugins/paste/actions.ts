import type { LastContentPasted } from '@atlaskit/editor-plugin-paste';

export enum PastePluginActionTypes {
  START_TRACKING_PASTED_MACRO_POSITIONS = 'START_TRACKING_PASTED_MACRO_POSITIONS',
  STOP_TRACKING_PASTED_MACRO_POSITIONS = 'STOP_TRACKING_PASTED_MACRO_POSITIONS',
  ON_PASTE = 'ON_PASTE',
}

export interface StartTrackingPastedMacroPositions {
  type: PastePluginActionTypes.START_TRACKING_PASTED_MACRO_POSITIONS;
  pastedMacroPositions: {
    [key: string]: number;
  };
}

export interface OnPaste {
  type: PastePluginActionTypes.ON_PASTE;
  contentPasted: LastContentPasted;
}

export interface StopTrackingPastedMacroPositions {
  type: PastePluginActionTypes.STOP_TRACKING_PASTED_MACRO_POSITIONS;
  pastedMacroPositionKeys: string[];
}

export type PastePluginAction =
  | StartTrackingPastedMacroPositions
  | StopTrackingPastedMacroPositions
  | OnPaste;
