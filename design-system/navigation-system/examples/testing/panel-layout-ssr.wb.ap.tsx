import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as PanelLayoutSsrExample } from '../panel-layout-ssr';

export const PanelLayoutSsr: WorkbenchExample<typeof PanelLayoutSsrExample> =
	wb(PanelLayoutSsrExample);
