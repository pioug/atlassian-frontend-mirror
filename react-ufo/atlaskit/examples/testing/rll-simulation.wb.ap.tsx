import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as RllSimulationExample } from '../22-rll-simulation';

export const RllSimulation: WorkbenchExample<typeof RllSimulationExample> =
	wb(RllSimulationExample);
