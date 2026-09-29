import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingDialogDismissedByExample from '../111-testing-dialog-dismissed-by';

export const TestingDialogDismissedBy: WorkbenchExample<typeof TestingDialogDismissedByExample> =
	wb(TestingDialogDismissedByExample);
