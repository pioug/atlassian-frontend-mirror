import { wb, type WorkbenchExample } from '@atlassian/workbench';

import MismatchedIdsExample from '../panel-layout-ssr-mismatched-ids';

export const PanelLayoutSsrMismatchedIds: WorkbenchExample<typeof MismatchedIdsExample> =
	wb(MismatchedIdsExample);
