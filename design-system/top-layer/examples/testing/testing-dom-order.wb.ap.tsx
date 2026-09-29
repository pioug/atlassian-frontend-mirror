import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingDomOrderExample from '../100-testing-dom-order';

export const TestingDomOrder: WorkbenchExample<typeof TestingDomOrderExample> =
	wb(TestingDomOrderExample);
