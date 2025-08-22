import type { LastContentPasted } from '../pastePluginType';

export enum PastePluginActionTypes {
	START_TRACKING_PASTED_MACRO_POSITIONS = 'START_TRACKING_PASTED_MACRO_POSITIONS',
	STOP_TRACKING_PASTED_MACRO_POSITIONS = 'STOP_TRACKING_PASTED_MACRO_POSITIONS',
	ON_PASTE = 'ON_PASTE',
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

export type PastePluginAction =
	| StartTrackingPastedMacroPositions
	| StopTrackingPastedMacroPositions
	| OnPaste;
