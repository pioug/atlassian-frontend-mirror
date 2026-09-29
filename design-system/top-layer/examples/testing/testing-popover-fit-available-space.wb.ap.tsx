import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingPopoverFitAvailableSpaceExample from '../160-testing-popover-fit-available-space';

export const TestingPopoverFitAvailableSpace: WorkbenchExample<
	typeof TestingPopoverFitAvailableSpaceExample
> = wb(TestingPopoverFitAvailableSpaceExample);
