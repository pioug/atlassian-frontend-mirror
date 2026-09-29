import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingManualPopoverA11yExample from '../120-testing-manual-popover-a11y';

export const TestingManualPopoverA11y: WorkbenchExample<typeof TestingManualPopoverA11yExample> =
	wb(TestingManualPopoverA11yExample);
