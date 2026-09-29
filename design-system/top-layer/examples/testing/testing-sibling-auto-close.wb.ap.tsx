import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingSiblingAutoCloseExample from '../106-testing-sibling-auto-close';

export const TestingSiblingAutoClose: WorkbenchExample<typeof TestingSiblingAutoCloseExample> = wb(
	TestingSiblingAutoCloseExample,
);
