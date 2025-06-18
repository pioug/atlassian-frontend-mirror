import type { ACTION, ACTION_SUBJECT } from './enums';
import type { OperationalAEP, TrackAEP } from './utils';

export type BreakoutSupportedNodes = 'layoutSection' | 'expand' | 'codeBlock';

export type BreakoutResizedAEP = TrackAEP<
	ACTION.RESIZED,
	ACTION_SUBJECT.ELEMENT,
	undefined,
	{ nodeType: BreakoutSupportedNodes; prevWidth?: number; newWidth?: number },
	undefined
>;

export type BreakoutResizedPerfSamplingAEP = OperationalAEP<
	ACTION.RESIZED_PERF_SAMPLING,
	ACTION_SUBJECT.ELEMENT,
	undefined,
	{
		nodeType: BreakoutSupportedNodes;
		frameRate: number;
		nodeSize: number;
		docSize: number;
		isInitialSample: boolean;
	}
>;

export type ChangedBreakoutModeAEP = TrackAEP<
	ACTION.CHANGED_BREAKOUT_MODE,
	ACTION_SUBJECT.ELEMENT,
	undefined,
	{ mode: 'center' | 'wide' | 'full-width'; nodeType: BreakoutSupportedNodes },
	undefined
>;

export type BreakoutEventPayload =
	| BreakoutResizedAEP
	| BreakoutResizedPerfSamplingAEP
	| ChangedBreakoutModeAEP;
