import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingNestedFocusRestorationExample from '../140-testing-nested-focus-restoration';

export const TestingNestedFocusRestoration: WorkbenchExample<
	typeof TestingNestedFocusRestorationExample
> = wb(TestingNestedFocusRestorationExample);
