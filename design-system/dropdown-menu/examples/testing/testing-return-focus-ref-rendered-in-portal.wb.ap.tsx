import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingReturnFocusRefRenderedInPortalExample from '../90-testing-return-focus-ref-rendered-in-portal';

export const TestingReturnFocusRefRenderedInPortal: WorkbenchExample<
	typeof TestingReturnFocusRefRenderedInPortalExample
> = wb(TestingReturnFocusRefRenderedInPortalExample);
