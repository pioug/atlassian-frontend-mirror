import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingCheckboxStatelessExample from '../94-testing-checkbox-stateless';

export const TestingCheckboxStateless: WorkbenchExample<typeof TestingCheckboxStatelessExample> =
	wb(TestingCheckboxStatelessExample);
