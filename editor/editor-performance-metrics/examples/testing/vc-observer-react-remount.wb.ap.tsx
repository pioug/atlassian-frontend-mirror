import type { WorkbenchExample } from '@atlassian/workbench';

import { wbWithEditorMetrics } from './wb-with-editor-metrics';

export const VcObserverReactRemount: WorkbenchExample = wbWithEditorMetrics(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-metrics-react-remount" */ '../03-vc-observer-react-remount'
		),
);
