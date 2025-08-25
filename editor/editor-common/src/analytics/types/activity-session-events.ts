import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID } from './enums';
import type { TrackAEP } from './utils';

export type ActiveSessionEventAttributes = {
	contentSizeChanged: number;
	effectiveness: {
		repeatedActionCount: number;
		safeInsertCount: number;
		undoCount: number;
	};
	efficiency: {
		actionByTypeCount?: {
			contentDeletedCount: number;
			contentMovedCount: number;
			markChangeCount: number;
			nodeAttributeChangeCount: number;
			nodeDeletionCount: number;
			nodeInsertionCount: number;
			other: number;
			textInputCount: number;
			undoCount: number;
		};
		totalActionCount: number;
		totalActiveTime: number;
	};
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
