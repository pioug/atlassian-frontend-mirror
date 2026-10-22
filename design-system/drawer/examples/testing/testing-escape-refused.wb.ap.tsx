import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingEscapeRefusedExample from '../99-testing-escape-refused';

export const TestingEscapeRefused: WorkbenchExample<typeof TestingEscapeRefusedExample> = wb(
	TestingEscapeRefusedExample,
);
