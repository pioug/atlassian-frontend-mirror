import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingDdmStatelessExample from '../97-testing-ddm-stateless';

export const TestingDdmStateless: WorkbenchExample<typeof TestingDdmStatelessExample> = wb(
	TestingDdmStatelessExample,
);
