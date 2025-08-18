import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID } from './enums';
import type { TrackAEP, UIAEP } from './utils';

type ElementAttributes = {
	nodeDepth: number;
	// Ignored via go/ees007
	// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
	// TODO: when clean up `platform_editor_element_drag_and_drop_multiselect`
	// remove `nodeType` since `nodeTypes` will cover the same information
	nodeType: string;
	destinationNodeDepth?: number;
	destinationNodeType?: string;
	isSameParent?: boolean;
	inputMethod?: string;
	// distinctive types of node that are involved in the operation
	nodeTypes?: string;
	// whether there are multiple nodes involved
	hasSelectedMultipleNodes?: boolean;
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
