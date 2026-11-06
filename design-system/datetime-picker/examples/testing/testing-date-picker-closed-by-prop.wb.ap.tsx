import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingDatePickerClosedByPropExample from '../testing-date-picker-closed-by-prop';

export const TestingDatePickerClosedByProp: WorkbenchExample<
	typeof TestingDatePickerClosedByPropExample
> = wb(TestingDatePickerClosedByPropExample);
