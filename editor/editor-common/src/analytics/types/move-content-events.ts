import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID } from './enums';
import type { TrackAEP } from './utils';

type MoveContentAEP = TrackAEP<
	ACTION.MOVED,
	ACTION_SUBJECT.DOCUMENT,
	ACTION_SUBJECT_ID.NODE,
	{
		nodeType?: string;
		nodeDepth?: number;
		destinationNodeDepth?: number;
	},
	undefined
>;

export type MoveContentEventPayload = MoveContentAEP;
