import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID } from './enums';
import type { TrackAEP, UIAEP } from './utils';

type ElementAttributes = {
	destinationNodeDepth?: number;
	destinationNodeType?: string;
	// whether there are multiple nodes involved
	hasSelectedMultipleNodes?: boolean;
	inputMethod?: string;
	isSameParent?: boolean;
	nodeDepth: number;
	// distinctive types of node that are involved in the operation
	nodeTypes?: string;
};

type ElementMovedAEP = TrackAEP<
	ACTION.MOVED,
	ACTION_SUBJECT.ELEMENT,
	ACTION_SUBJECT_ID.ELEMENT_DRAG_HANDLE,
	ElementAttributes,
	null
>;

type ElementDragAEP = UIAEP<
	ACTION.DRAGGED,
	ACTION_SUBJECT.ELEMENT,
	ACTION_SUBJECT_ID.ELEMENT_DRAG_HANDLE,
	ElementAttributes,
	null
>;

type ElementDragEndAEP = TrackAEP<
	ACTION.ENDED,
	ACTION_SUBJECT.DRAG,
	ACTION_SUBJECT_ID.ELEMENT_DRAG_HANDLE,
	{
		dragInitializationDuration: number;
		dropProcessingDuration: number;
		isCancelled: boolean;
		nodesCount: number | undefined;
	},
	null
>;

type DragCancelledAEP = UIAEP<
	ACTION.CANCELLED,
	ACTION_SUBJECT.DRAG,
	ACTION_SUBJECT_ID.ELEMENT_DRAG_HANDLE,
	ElementAttributes,
	null
>;

type ElementClickedAEP = UIAEP<
	ACTION.CLICKED,
	ACTION_SUBJECT.BUTTON,
	ACTION_SUBJECT_ID.ELEMENT_DRAG_HANDLE,
	ElementAttributes,
	null
>;

export type ElementEventPayload =
	| ElementClickedAEP
	| ElementMovedAEP
	| ElementDragAEP
	| ElementDragEndAEP
	| DragCancelledAEP;
