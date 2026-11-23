import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingManualAskFirstCloseExample from '../173-testing-manual-ask-first-close';

export const TestingManualAskFirstClose: WorkbenchExample<
	typeof TestingManualAskFirstCloseExample
> = wb(TestingManualAskFirstCloseExample);
