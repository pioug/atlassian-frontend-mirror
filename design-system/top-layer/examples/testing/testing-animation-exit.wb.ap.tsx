import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingAnimationExitExample from '../125-testing-animation-exit';

export const TestingAnimationExit: WorkbenchExample<typeof TestingAnimationExitExample> = wb(
	TestingAnimationExitExample,
);
