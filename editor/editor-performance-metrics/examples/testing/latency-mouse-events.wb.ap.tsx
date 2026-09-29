import { wb, type WorkbenchExample } from '@atlassian/workbench';

import LatencyMouseEventsExample from '../02-latency-mouse-events';

export const LatencyMouseEvents: WorkbenchExample<typeof LatencyMouseEventsExample> =
	wb(LatencyMouseEventsExample);
