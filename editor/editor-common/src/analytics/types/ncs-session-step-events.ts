import { type ACTION, type ACTION_SUBJECT } from './enums';
import type { OperationalAEP } from './utils';

export type NcsSessionStepMetrics = {
	maxStepSize: number;
	ncsSessionId?: string;
	numberOfSteps: number;
	p90StepSize?: number;
	stepSizeSumForP90?: number[];
	totalStepSize: number;
};

export type NcsSessionStepEventAEP = OperationalAEP<
	ACTION.NCS_SESSION_STEP_METRICS,
	ACTION_SUBJECT.COLLAB,
	undefined,
	NcsSessionStepMetrics
>;
