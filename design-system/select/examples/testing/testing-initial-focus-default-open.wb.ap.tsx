import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingInitialFocusDefaultOpenExample from '../98-testing-initial-focus-default-open';

export const TestingInitialFocusDefaultOpen: WorkbenchExample<
	typeof TestingInitialFocusDefaultOpenExample
> = wb(TestingInitialFocusDefaultOpenExample);
