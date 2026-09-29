import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingDialogFocusTrapExample from '../96-testing-dialog-focus-trap';

export const TestingDialogFocusTrap: WorkbenchExample<typeof TestingDialogFocusTrapExample> = wb(
	TestingDialogFocusTrapExample,
);
