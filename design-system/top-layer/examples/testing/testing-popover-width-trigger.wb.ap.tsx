import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingPopoverWidthTriggerExample from '../114-testing-popover-width-trigger';

export const TestingPopoverWidthTrigger: WorkbenchExample<
	typeof TestingPopoverWidthTriggerExample
> = wb(TestingPopoverWidthTriggerExample);
