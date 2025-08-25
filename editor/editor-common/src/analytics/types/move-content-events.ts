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
		// Ignored via go/ees007
		// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
		// TODO: when clean up `platform_editor_element_drag_and_drop_multiselect`, consider removing nodeName since `nodeTypes` will cover both single/multiple nodes
		nodeType?: string;
		nodeTypes?: string;
	},
	undefined
>;

export type MoveContentEventPayload = MoveContentAEP;
