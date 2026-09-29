import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingNestedFocusScopeExample from '../135-testing-nested-focus-scope';

export const TestingNestedFocusScope: WorkbenchExample<typeof TestingNestedFocusScopeExample> = wb(
	TestingNestedFocusScopeExample,
);
