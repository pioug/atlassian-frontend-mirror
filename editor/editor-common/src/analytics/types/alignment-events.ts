import {
	type ACTION,
	type ACTION_SUBJECT,
	type INPUT_METHOD,
	type ACTION_SUBJECT_ID,
} from './enums';
import { type TrackAEP } from './utils';

type AlignmentUpdatedAEP = TrackAEP<
	ACTION.UPDATED,
	ACTION_SUBJECT.ALIGNMENT,
	ACTION_SUBJECT_ID,
	{
		alignmentType?: 'start' | 'end' | 'center';
		inputMethod?: INPUT_METHOD.TOOLBAR | INPUT_METHOD.FLOATING_TB | INPUT_METHOD.SHORTCUT;
	},
	undefined
>;

export type AlignmentEventPayload = AlignmentUpdatedAEP;
