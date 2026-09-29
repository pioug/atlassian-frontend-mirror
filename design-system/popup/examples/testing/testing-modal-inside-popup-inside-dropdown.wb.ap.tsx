import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingModalInsidePopupInsideDropdownExample from '../testing-modal-inside-popup-inside-dropdown';

export const TestingModalInsidePopupInsideDropdown: WorkbenchExample<
	typeof TestingModalInsidePopupInsideDropdownExample
> = wb(TestingModalInsidePopupInsideDropdownExample);
