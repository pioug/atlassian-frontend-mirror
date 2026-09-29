import { wb, type WorkbenchExample } from '@atlassian/workbench';

import SelectDatepickerExample from '../04-select-datepicker';

export const SelectDatepicker: WorkbenchExample<typeof SelectDatepickerExample> =
	wb(SelectDatepickerExample);
