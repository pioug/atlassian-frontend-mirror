import { ACTION, ACTION_SUBJECT } from './enums';
import type { OperationalAEP } from './utils';

export type NcsSessionStepMetrics = {
	ncsSessionId?: string;
	totalStepSize: number;
	numberOfSteps: number;
	maxStepSize: number;
	stepSizeSumForP90?: number[];
	p90StepSize?: number;
};

export type NcsSessionStepEventAEP = OperationalAEP<
	ACTION.NCS_SESSION_STEP_METRICS,
	ACTION_SUBJECT.COLLAB,
	undefined,
	NcsSessionStepMetrics
>;
