import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingAskFirstCloseExample from '../99-testing-ask-first-close';

export const TestingAskFirstClose: WorkbenchExample<typeof TestingAskFirstCloseExample> = wb(
	TestingAskFirstCloseExample,
);
