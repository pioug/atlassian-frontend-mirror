import { wb, type WorkbenchExample } from '@atlassian/workbench';

import LatencyKeyboardEventsExample from '../04-latency-keyboard-events';

export const LatencyKeyboardEvents: WorkbenchExample<typeof LatencyKeyboardEventsExample> = wb(
	LatencyKeyboardEventsExample,
);
