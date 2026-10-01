import type { WorkbenchExample } from '@atlassian/workbench';

import { wbWithEditorMetrics } from './wb-with-editor-metrics';

export const LatencyKeyboardEvents: WorkbenchExample = wbWithEditorMetrics(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-metrics-latency-keyboard" */ '../04-latency-keyboard-events'
		),
);
