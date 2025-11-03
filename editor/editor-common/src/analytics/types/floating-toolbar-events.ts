import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID } from './enums';
import type { TrackAEP } from './utils';

export type FloatingToolbarSuppressedAEP = TrackAEP<
	ACTION.SUPPRESSED,
	ACTION_SUBJECT.FLOATING_TOOLBAR_PLUGIN,
	ACTION_SUBJECT_ID.FLOATING_TOOLBAR,
	undefined,
	undefined
>;

export type FloatingToolbarEventPayload = FloatingToolbarSuppressedAEP;
