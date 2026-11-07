import { wb, type WorkbenchExample } from '@atlassian/workbench';

import AllOpenSsrExample from '../panel-layout-all-open-ssr';

export const PanelLayoutAllOpenSsr: WorkbenchExample<typeof AllOpenSsrExample> =
	wb(AllOpenSsrExample);
