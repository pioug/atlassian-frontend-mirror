import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingFitViewportExample from '../98-testing-fit-viewport';

export const TestingFitViewport: WorkbenchExample<typeof TestingFitViewportExample> =
	wb(TestingFitViewportExample);
