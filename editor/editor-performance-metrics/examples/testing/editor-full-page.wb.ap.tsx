import type { WorkbenchExample } from '@atlassian/workbench';

import { wbWithEditorMetrics } from './wb-with-editor-metrics';

export const EditorFullPage: WorkbenchExample = wbWithEditorMetrics(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-metrics-editor-full-page" */ '../05-editor-full-page'
		),
);
