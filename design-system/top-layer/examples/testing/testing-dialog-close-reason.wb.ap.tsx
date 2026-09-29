import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingDialogCloseReasonExample from '../93-testing-dialog-close-reason';

export const TestingDialogCloseReason: WorkbenchExample<typeof TestingDialogCloseReasonExample> =
	wb(TestingDialogCloseReasonExample);
