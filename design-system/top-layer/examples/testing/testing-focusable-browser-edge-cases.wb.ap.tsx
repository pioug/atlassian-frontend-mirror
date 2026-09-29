import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingFocusableBrowserEdgeCasesExample from '../141-testing-focusable-browser-edge-cases';

export const TestingFocusableBrowserEdgeCases: WorkbenchExample<
	typeof TestingFocusableBrowserEdgeCasesExample
> = wb(TestingFocusableBrowserEdgeCasesExample);
