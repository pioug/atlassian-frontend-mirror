import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID } from './enums';
import type { TrackAEP } from './utils';

type MoveContentAEP = TrackAEP<
	ACTION.MOVED,
	ACTION_SUBJECT.DOCUMENT,
	ACTION_SUBJECT_ID.NODE,
	{
		destinationNodeDepth?: number;
		hasSelectedMultipleNodes?: boolean;
		nodeDepth?: number;
		nodeTypes?: string;
	},
	undefined
>;

export type MoveContentEventPayload = MoveContentAEP;
