import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingPopoverCloseAfterFocusLossExample from '../172-testing-popover-close-after-focus-loss';

export const TestingPopoverCloseAfterFocusLoss: WorkbenchExample<
	typeof TestingPopoverCloseAfterFocusLossExample
> = wb(TestingPopoverCloseAfterFocusLossExample);
