import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingManualCoexistenceExample from '../116-testing-manual-coexistence';

export const TestingManualCoexistence: WorkbenchExample<typeof TestingManualCoexistenceExample> =
	wb(TestingManualCoexistenceExample);
