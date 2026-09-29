import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingFormInPopupExample from '../130-testing-form-in-popup';

export const TestingFormInPopup: WorkbenchExample<typeof TestingFormInPopupExample> =
	wb(TestingFormInPopupExample);
