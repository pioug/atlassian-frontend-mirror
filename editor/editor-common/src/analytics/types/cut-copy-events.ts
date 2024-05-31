import type { ACTION, ACTION_SUBJECT } from './enums';
import type { TrackAEP } from './utils';

type CopyAEP = TrackAEP<
	ACTION.COPIED,
	ACTION_SUBJECT.DOCUMENT,
	undefined,
	{
		content: string[];
		inputMethod?: string;
		nodeType?: string;
		extensionType?: string;
		extensionKey?: string;
	},
	undefined
>;

type CutAEP = TrackAEP<
	ACTION.CUT,
	ACTION_SUBJECT.DOCUMENT,
	undefined,
	{
		content: string[];
		nodeType?: string;
		extensionType?: string;
		extensionKey?: string;
	},
	undefined
>;

export type CutCopyEventPayload = CutAEP | CopyAEP;
