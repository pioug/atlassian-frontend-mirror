import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingDialogInAutoPopoverExample from '../167-testing-dialog-in-auto-popover';

export const TestingDialogInAutoPopover: WorkbenchExample<
	typeof TestingDialogInAutoPopoverExample
> = wb(TestingDialogInAutoPopoverExample);
