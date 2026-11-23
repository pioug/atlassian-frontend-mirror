import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingPopupSelectAskFirstCloseExample from '../96-testing-popup-select-ask-first-close';

export const TestingPopupSelectAskFirstClose: WorkbenchExample<
	typeof TestingPopupSelectAskFirstCloseExample
> = wb(TestingPopupSelectAskFirstCloseExample);
