import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingDdmDefaultExample from '../98-testing-ddm-default';

export const TestingDdmDefault: WorkbenchExample<typeof TestingDdmDefaultExample> =
	wb(TestingDdmDefaultExample);
