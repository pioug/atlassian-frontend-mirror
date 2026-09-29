import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingExample from '../testing';

export const Testing: WorkbenchExample<typeof TestingExample> = wb(TestingExample);
