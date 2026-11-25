import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingFocusRingExample from '../107-testing-focus-ring';

export const TestingFocusRing: WorkbenchExample<typeof TestingFocusRingExample> =
	wb(TestingFocusRingExample);
