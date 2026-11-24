import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingItemFocusReturnExample from '../99-testing-item-focus-return';

export const TestingItemFocusReturn: WorkbenchExample<typeof TestingItemFocusReturnExample> = wb(
	TestingItemFocusReturnExample,
);
