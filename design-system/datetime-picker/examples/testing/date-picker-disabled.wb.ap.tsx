import { wb, type WorkbenchExample } from '@atlassian/workbench';

import DatePickerDisabledExample from '../12-date-picker-disabled';

export const DatePickerDisabled: WorkbenchExample<typeof DatePickerDisabledExample> =
	wb(DatePickerDisabledExample);
