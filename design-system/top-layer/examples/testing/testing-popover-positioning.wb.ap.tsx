import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingPopoverPositioningExample from '../112-testing-popover-positioning';

export const TestingPopoverPositioning: WorkbenchExample<typeof TestingPopoverPositioningExample> =
	wb(TestingPopoverPositioningExample);
