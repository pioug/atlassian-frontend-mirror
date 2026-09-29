import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingPopoverInitialFocusExample from '../123-testing-popover-initial-focus';

export const TestingPopoverInitialFocus: WorkbenchExample<
	typeof TestingPopoverInitialFocusExample
> = wb(TestingPopoverInitialFocusExample);
