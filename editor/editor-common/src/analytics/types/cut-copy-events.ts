import type { ACTION, ACTION_SUBJECT } from './enums';
import type { TrackAEP } from './utils';

type CopyAEP = TrackAEP<
	ACTION.COPIED,
	ACTION_SUBJECT.DOCUMENT,
	undefined,
	{
		content: string[];
		extensionKey?: string;
		extensionType?: string;
		inputMethod?: string;
		nodeType?: string;
	},
	undefined
>;

type CutAEP = TrackAEP<
	ACTION.CUT,
	ACTION_SUBJECT.DOCUMENT,
	undefined,
	{
		content: string[];
		extensionKey?: string;
		extensionType?: string;
		nodeType?: string;
	},
	undefined
>;

export type CutCopyEventPayload = CutAEP | CopyAEP;
