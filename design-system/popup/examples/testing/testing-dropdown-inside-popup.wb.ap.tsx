import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingDropdownInsidePopupExample from '../testing-dropdown-inside-popup';

export const TestingDropdownInsidePopup: WorkbenchExample<
	typeof TestingDropdownInsidePopupExample
> = wb(TestingDropdownInsidePopupExample);
