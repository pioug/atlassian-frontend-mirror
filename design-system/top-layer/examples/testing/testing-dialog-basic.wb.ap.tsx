import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingDialogBasicExample from '../91-testing-dialog-basic';

export const TestingDialogBasic: WorkbenchExample<typeof TestingDialogBasicExample> =
	wb(TestingDialogBasicExample);
