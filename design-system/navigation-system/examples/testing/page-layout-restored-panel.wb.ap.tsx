import { wb, type WorkbenchExample } from '@atlassian/workbench';

import RestoredPanelExample from '../page-layout-restored-panel';

export const PageLayoutRestoredPanel: WorkbenchExample<typeof RestoredPanelExample> =
	wb(RestoredPanelExample);
