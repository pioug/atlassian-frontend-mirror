import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingFocusReturnRefExample from '../129-testing-focus-return-ref';

export const TestingFocusReturnRef: WorkbenchExample<typeof TestingFocusReturnRefExample> = wb(
	TestingFocusReturnRefExample,
);
