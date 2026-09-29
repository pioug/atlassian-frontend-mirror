import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingManualPopoverFocusExample from '../133-testing-manual-popover-focus';

export const TestingManualPopoverFocus: WorkbenchExample<typeof TestingManualPopoverFocusExample> =
	wb(TestingManualPopoverFocusExample);
