import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingPopoverInDialogExample from '../97-testing-popover-in-dialog';

export const TestingPopoverInDialog: WorkbenchExample<typeof TestingPopoverInDialogExample> = wb(
	TestingPopoverInDialogExample,
);
