import type { ACTION, ACTION_SUBJECT } from './enums';
import type { TrackAEP } from './utils';

type ContextMenuOpenAEP = TrackAEP<
	ACTION.OPENED,
	ACTION_SUBJECT.CONTEXT_MENU,
	undefined,
	{
		button: number;
		altKey: boolean;
		ctrlKey: boolean;
		shiftKey: boolean;
		metaKey: boolean;
	},
	undefined
>;

export type ContextMenuEventPayload = ContextMenuOpenAEP;
