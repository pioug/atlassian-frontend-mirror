import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingPopupWithDatetimePickerEscapeExample from '../testing-popup-with-datetime-picker-escape';

export const TestingPopupWithDatetimePickerEscape: WorkbenchExample<
	typeof TestingPopupWithDatetimePickerEscapeExample
> = wb(TestingPopupWithDatetimePickerEscapeExample);
