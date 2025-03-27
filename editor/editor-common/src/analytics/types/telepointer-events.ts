import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID } from './enums';
import type { TrackAEP } from './utils';

type TelepointerClickAEP = TrackAEP<
	ACTION.CLICKED,
	ACTION_SUBJECT.TELEPOINTER,
	ACTION_SUBJECT_ID.TELEPOINTER,
	undefined,
	undefined
>;

export type TelepointerClickPayload = TelepointerClickAEP;
