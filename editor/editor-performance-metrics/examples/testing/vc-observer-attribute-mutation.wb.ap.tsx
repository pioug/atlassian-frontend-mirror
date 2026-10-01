import type { WorkbenchExample } from '@atlassian/workbench';

import { wbWithEditorMetrics } from './wb-with-editor-metrics';

export const VcObserverAttributeMutation: WorkbenchExample = wbWithEditorMetrics(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-metrics-attribute-mutation" */ '../02-vc-observer-attribute-mutation'
		),
);
