import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingPopupWithDropdownEscapeExample from '../testing-popup-with-dropdown-escape';

export const TestingPopupWithDropdownEscape: WorkbenchExample<
	typeof TestingPopupWithDropdownEscapeExample
> = wb(TestingPopupWithDropdownEscapeExample);
