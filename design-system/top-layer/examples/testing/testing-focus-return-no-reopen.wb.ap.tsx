import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingFocusReturnNoReopenExample from '../105-testing-focus-return-no-reopen';

export const TestingFocusReturnNoReopen: WorkbenchExample<
	typeof TestingFocusReturnNoReopenExample
> = wb(TestingFocusReturnNoReopenExample);
