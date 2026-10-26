import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as PageLayoutCallerOwnedPanelExample } from '../page-layout-caller-owned-panel';

export const PageLayoutCallerOwnedPanel: WorkbenchExample<
	typeof PageLayoutCallerOwnedPanelExample
> = wb(PageLayoutCallerOwnedPanelExample);
