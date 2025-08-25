import {
	type ACTION,
	type ACTION_SUBJECT,
	type ACTION_SUBJECT_ID,
	type INPUT_METHOD,
} from './enums';
import { type TrackAEP } from './utils';

type TypeDateStartedAEP = TrackAEP<
	ACTION.TYPING_STARTED,
	ACTION_SUBJECT.DATE,
	undefined,
	undefined,
	undefined
>;

type TypeDateFinishedAEP = TrackAEP<
	ACTION.TYPING_FINISHED,
	ACTION_SUBJECT.DATE,
	undefined,
	undefined,
	undefined
>;

type IncrementDateSegmentAEP = TrackAEP<
	ACTION.INCREMENTED,
	ACTION_SUBJECT.DATE_SEGMENT,
	undefined,
	{
		dateSegment:
			| ACTION_SUBJECT_ID.DATE_DAY
			| ACTION_SUBJECT_ID.DATE_MONTH
			| ACTION_SUBJECT_ID.DATE_YEAR;
	},
	undefined
>;

type DecrementDateSegmentAEP = TrackAEP<
	ACTION.DECREMENTED,
	ACTION_SUBJECT.DATE_SEGMENT,
	undefined,
	{
		dateSegment:
			| ACTION_SUBJECT_ID.DATE_DAY
			| ACTION_SUBJECT_ID.DATE_MONTH
			| ACTION_SUBJECT_ID.DATE_YEAR;
	},
	undefined
>;

type CommitDateAEP = TrackAEP<
	ACTION.COMMITTED,
	ACTION_SUBJECT.DATE,
	undefined,
	{
		commitMethod: INPUT_METHOD.PICKER | INPUT_METHOD.BLUR | INPUT_METHOD.KEYBOARD;
		isToday: true | false;
		isValid: true | false;
	},
	undefined
>;

export type DateEventPayload =
	| TypeDateStartedAEP
	| TypeDateFinishedAEP
	| IncrementDateSegmentAEP
	| DecrementDateSegmentAEP
	| CommitDateAEP;
