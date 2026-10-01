import type { WorkbenchExample } from '@atlassian/workbench';

import { wbWithEditorMetrics } from './wb-with-editor-metrics';

export const VcObserverMovingNode: WorkbenchExample = wbWithEditorMetrics(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-metrics-moving-node" */ '../02-vc-observer-moving-node'
		),
);
