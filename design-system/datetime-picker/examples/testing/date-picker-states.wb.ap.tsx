import { wb, type WorkbenchExample } from '@atlassian/workbench';

import DatePickerStatesExample from '../10-date-picker-states';

export const DatePickerStates: WorkbenchExample<typeof DatePickerStatesExample> =
	wb(DatePickerStatesExample);
