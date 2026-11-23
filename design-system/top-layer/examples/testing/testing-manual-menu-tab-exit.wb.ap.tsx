import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingManualMenuTabExitExample from '../177-testing-manual-menu-tab-exit';

export const TestingManualMenuTabExit: WorkbenchExample<typeof TestingManualMenuTabExitExample> =
	wb(TestingManualMenuTabExitExample);
