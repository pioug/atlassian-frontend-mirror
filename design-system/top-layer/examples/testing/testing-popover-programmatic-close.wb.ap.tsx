import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingPopoverProgrammaticCloseExample from '../104-testing-popover-programmatic-close';

export const TestingPopoverProgrammaticClose: WorkbenchExample<
	typeof TestingPopoverProgrammaticCloseExample
> = wb(TestingPopoverProgrammaticCloseExample);
