import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingDialogCloseTimingExample from '../110-testing-dialog-close-timing';

export const TestingDialogCloseTiming: WorkbenchExample<typeof TestingDialogCloseTimingExample> =
	wb(TestingDialogCloseTimingExample);
