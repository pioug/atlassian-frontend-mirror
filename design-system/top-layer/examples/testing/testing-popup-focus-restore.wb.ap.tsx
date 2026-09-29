import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingPopupFocusRestoreExample from '../122-testing-popup-focus-restore';

export const TestingPopupFocusRestore: WorkbenchExample<typeof TestingPopupFocusRestoreExample> =
	wb(TestingPopupFocusRestoreExample);
