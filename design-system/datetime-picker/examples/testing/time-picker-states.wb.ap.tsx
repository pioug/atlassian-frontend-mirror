import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TimePickerStatesExample from '../30-time-picker-states';

export const TimePickerStates: WorkbenchExample<typeof TimePickerStatesExample> =
	wb(TimePickerStatesExample);
