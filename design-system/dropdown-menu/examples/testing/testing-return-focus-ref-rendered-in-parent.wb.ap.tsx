import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingReturnFocusRefRenderedInParentExample from '../90-testing-return-focus-ref-rendered-in-parent';

export const TestingReturnFocusRefRenderedInParent: WorkbenchExample<
	typeof TestingReturnFocusRefRenderedInParentExample
> = wb(TestingReturnFocusRefRenderedInParentExample);
