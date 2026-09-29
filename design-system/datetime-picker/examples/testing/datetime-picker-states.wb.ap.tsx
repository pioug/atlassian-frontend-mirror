import { wb, type WorkbenchExample } from '@atlassian/workbench';

import DatetimePickerStatesExample from '../20-datetime-picker-states';

export const DatetimePickerStates: WorkbenchExample<typeof DatetimePickerStatesExample> = wb(
	DatetimePickerStatesExample,
);
