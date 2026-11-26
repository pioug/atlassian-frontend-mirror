import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingConsumedEscapeExample from '../180-testing-consumed-escape';

export const TestingConsumedEscape: WorkbenchExample<typeof TestingConsumedEscapeExample> = wb(
	TestingConsumedEscapeExample,
);
