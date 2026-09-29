import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingInitialFocusMatrixExample from '../98-testing-initial-focus-matrix';

export const TestingInitialFocusMatrix: WorkbenchExample<typeof TestingInitialFocusMatrixExample> =
	wb(TestingInitialFocusMatrixExample);
