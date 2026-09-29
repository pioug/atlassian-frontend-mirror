import { wb, type WorkbenchExample } from '@atlassian/workbench';

import DatePickerTabcheckExample from '../14-date-picker-tabcheck';

export const DatePickerTabcheck: WorkbenchExample<typeof DatePickerTabcheckExample> =
	wb(DatePickerTabcheckExample);
