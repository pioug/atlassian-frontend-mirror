import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingNestedPopoversExample from '../94-testing-nested-popovers';

export const TestingNestedPopovers: WorkbenchExample<typeof TestingNestedPopoversExample> = wb(
	TestingNestedPopoversExample,
);
