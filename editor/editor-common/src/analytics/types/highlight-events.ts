import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, INPUT_METHOD } from './enums';
import type { TrackAEP } from './utils';

export type HighlightToolbarToggleAEP = TrackAEP<
	ACTION.OPENED | ACTION.CLOSED,
	ACTION_SUBJECT.TOOLBAR,
	ACTION_SUBJECT_ID.FORMAT_BACKGROUND_COLOR,
	{
		inputMethod: INPUT_METHOD;
	},
	undefined
>;

export type HighlightTextAEP = TrackAEP<
	ACTION.FORMATTED,
	ACTION_SUBJECT.TEXT,
	ACTION_SUBJECT_ID.FORMAT_BACKGROUND_COLOR,
	{
		newColor: string;
		previousColor: string;
		inputMethod: INPUT_METHOD;
	},
	undefined
>;

export type HighlightEventPayload = HighlightToolbarToggleAEP | HighlightTextAEP;
