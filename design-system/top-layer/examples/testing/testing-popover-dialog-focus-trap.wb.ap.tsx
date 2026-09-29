import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingPopoverDialogFocusTrapExample from '../121-testing-popover-dialog-focus-trap';

export const TestingPopoverDialogFocusTrap: WorkbenchExample<
	typeof TestingPopoverDialogFocusTrapExample
> = wb(TestingPopoverDialogFocusTrapExample);
