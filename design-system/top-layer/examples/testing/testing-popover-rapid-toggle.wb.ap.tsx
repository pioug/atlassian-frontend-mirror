import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingPopoverRapidToggleExample from '../118-testing-popover-rapid-toggle';

export const TestingPopoverRapidToggle: WorkbenchExample<typeof TestingPopoverRapidToggleExample> =
	wb(TestingPopoverRapidToggleExample);
