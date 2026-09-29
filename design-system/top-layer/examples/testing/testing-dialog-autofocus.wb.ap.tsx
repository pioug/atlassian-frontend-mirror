import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingDialogAutofocusExample from '../102-testing-dialog-autofocus';

export const TestingDialogAutofocus: WorkbenchExample<typeof TestingDialogAutofocusExample> = wb(
	TestingDialogAutofocusExample,
);
