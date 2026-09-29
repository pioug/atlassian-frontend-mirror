import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingInitialFocusMatrixExample from '../97-testing-initial-focus-matrix';

export const TestingInitialFocusMatrix: WorkbenchExample<typeof TestingInitialFocusMatrixExample> =
	wb(TestingInitialFocusMatrixExample);
