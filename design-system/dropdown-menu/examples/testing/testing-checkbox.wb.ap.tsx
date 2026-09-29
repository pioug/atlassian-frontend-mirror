import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingCheckboxExample from '../95-testing-checkbox';

export const TestingCheckbox: WorkbenchExample<typeof TestingCheckboxExample> =
	wb(TestingCheckboxExample);
