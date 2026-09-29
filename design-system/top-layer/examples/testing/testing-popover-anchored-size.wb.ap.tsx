import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingPopoverAnchoredSizeExample from '../161-testing-popover-anchored-size';

export const TestingPopoverAnchoredSize: WorkbenchExample<
	typeof TestingPopoverAnchoredSizeExample
> = wb(TestingPopoverAnchoredSizeExample);
