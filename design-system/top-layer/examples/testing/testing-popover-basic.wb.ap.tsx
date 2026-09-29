import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingPopoverBasicExample from '../90-testing-popover-basic';

export const TestingPopoverBasic: WorkbenchExample<typeof TestingPopoverBasicExample> = wb(
	TestingPopoverBasicExample,
);
