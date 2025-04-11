import { type ACTION, type ACTION_SUBJECT, type ACTION_SUBJECT_ID } from './enums';
import { type TrackAEP } from './utils';

export interface TextColorShowPaletteToggleAttr {
	noSelect: boolean;
}

export type TextColorShowPaletteToggleAEP = TrackAEP<
	ACTION.OPENED | ACTION.CLOSED,
	ACTION_SUBJECT.TOOLBAR,
	ACTION_SUBJECT_ID.FORMAT_COLOR,
	TextColorShowPaletteToggleAttr,
	undefined
>;

export type TextColorEventPayload = TextColorShowPaletteToggleAEP;
