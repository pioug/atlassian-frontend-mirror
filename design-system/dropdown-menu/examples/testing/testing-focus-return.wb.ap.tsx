import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingFocusReturnExample from '../96-testing-focus-return';

export const TestingFocusReturn: WorkbenchExample<typeof TestingFocusReturnExample> =
	wb(TestingFocusReturnExample);
