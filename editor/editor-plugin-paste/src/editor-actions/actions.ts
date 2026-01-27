import type { LastContentPasted, ActiveFlag } from '../pastePluginType';

export enum PastePluginActionTypes {
	START_TRACKING_PASTED_MACRO_POSITIONS = 'START_TRACKING_PASTED_MACRO_POSITIONS',
	STOP_TRACKING_PASTED_MACRO_POSITIONS = 'STOP_TRACKING_PASTED_MACRO_POSITIONS',
	ON_PASTE = 'ON_PASTE',
	SET_ACTIVE_FLAG = 'SET_ACTIVE_FLAG',
}

export interface StartTrackingPastedMacroPositions {
	pastedMacroPositions: {
		[key: string]: number;
	};
	type: PastePluginActionTypes.START_TRACKING_PASTED_MACRO_POSITIONS;
}

export interface OnPaste {
	contentPasted: LastContentPasted;
	type: PastePluginActionTypes.ON_PASTE;
}

export interface StopTrackingPastedMacroPositions {
	pastedMacroPositionKeys: string[];
	type: PastePluginActionTypes.STOP_TRACKING_PASTED_MACRO_POSITIONS;
}

export interface SetActiveFlag {
	activeFlag: ActiveFlag;
	type: PastePluginActionTypes.SET_ACTIVE_FLAG;
}

export type PastePluginAction =
	| StartTrackingPastedMacroPositions
	| StopTrackingPastedMacroPositions
	| OnPaste
	| SetActiveFlag;
