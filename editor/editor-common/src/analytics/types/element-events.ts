import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID } from './enums';
import type { TrackAEP, UIAEP } from './utils';

type ElementAttributes = {
	nodeDepth: number;
	nodeType: string;
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

type DragCancelledAEP = UIAEP<
	ACTION.CANCELLED,
	ACTION_SUBJECT.DRAG,
	ACTION_SUBJECT_ID.ELEMENT_DRAG_HANDLE,
	ElementAttributes,
	null
>;

export type ElementEventPayload = ElementMovedAEP | ElementDragAEP | DragCancelledAEP;
