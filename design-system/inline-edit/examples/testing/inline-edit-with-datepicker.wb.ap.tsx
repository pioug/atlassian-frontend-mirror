import { wb, type WorkbenchExample } from '@atlassian/workbench';

import InlineEditWithDatepickerExample from '../13-inline-edit-with-datepicker';

export const InlineEditWithDatepicker: WorkbenchExample<typeof InlineEditWithDatepickerExample> =
	wb(InlineEditWithDatepickerExample);
