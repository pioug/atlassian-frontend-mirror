import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingDialogTabTrapExample from '../101-testing-dialog-tab-trap';

export const TestingDialogTabTrap: WorkbenchExample<typeof TestingDialogTabTrapExample> = wb(
	TestingDialogTabTrapExample,
);
