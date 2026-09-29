import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingDialogScrollLockExample from '../98-testing-dialog-scroll-lock';

export const TestingDialogScrollLock: WorkbenchExample<typeof TestingDialogScrollLockExample> = wb(
	TestingDialogScrollLockExample,
);
