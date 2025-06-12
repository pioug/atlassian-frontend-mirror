import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID } from './enums';
import type { TrackAEP } from './utils';

export type ActiveSessionEventAttributes = {
	efficiency: {
		totalActiveTime: number;
		totalActionCount: number;
		actionByTypeCount?: {
			textInputCount: number;
			nodeInsertionCount: number;
			nodeAttributeChangeCount: number;
			contentMovedCount: number;
			nodeDeletionCount: number;
			undoCount: number;
			markChangeCount: number;
			contentDeletedCount: number;
			other: number;
		};
	};
	effectiveness: {
		undoCount: number;
		repeatedActionCount: number;
		safeInsertCount: number;
	};
	contentSizeChanged: number;
	toolbarDocking?: 'top' | 'none';
};

export type ActiveSessionEventAEP = TrackAEP<
	ACTION.ENDED,
	ACTION_SUBJECT.ACTIVITY_SESSION,
	ACTION_SUBJECT_ID.ACTIVITY,
	ActiveSessionEventAttributes,
	undefined
>;

export type ActiveSessionEventPayload = ActiveSessionEventAEP;
