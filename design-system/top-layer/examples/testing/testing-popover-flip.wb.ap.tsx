import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingPopoverFlipExample from '../113-testing-popover-flip';

export const TestingPopoverFlip: WorkbenchExample<typeof TestingPopoverFlipExample> =
	wb(TestingPopoverFlipExample);
