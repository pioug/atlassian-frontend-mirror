import type { ACTION, ACTION_SUBJECT } from './enums';
import type { TrackAEP } from './utils';

export type InitialEditorWidthPayload = TrackAEP<
	ACTION.INITIAL_EDITOR_WIDTH,
	ACTION_SUBJECT.EDITOR,
	undefined,
	{ width: number },
	undefined
>;
