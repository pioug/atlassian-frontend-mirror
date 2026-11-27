import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingCustomSizesExample from '../110-testing-custom-sizes';

export const TestingCustomSizes: WorkbenchExample<typeof TestingCustomSizesExample> =
	wb(TestingCustomSizesExample);
