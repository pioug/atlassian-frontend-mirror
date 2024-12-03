import type { ACTION, ACTION_SUBJECT } from './enums';
import type { TrackAEP } from './utils';

type BreakoutSupportedNodes = 'layoutSection' | 'expand' | 'codeBlock';

export type BreakoutResizedAEP = TrackAEP<
	ACTION.RESIZED,
	ACTION_SUBJECT.ELEMENT,
	undefined,
	{ nodeType: BreakoutSupportedNodes; prevWidth?: number; newWidth?: number },
	undefined
>;

export type BreakoutEventPayload = BreakoutResizedAEP;
