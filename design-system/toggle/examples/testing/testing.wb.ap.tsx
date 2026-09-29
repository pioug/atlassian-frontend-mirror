import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingExample from '../99-testing';

export const Testing: WorkbenchExample<typeof TestingExample> = wb(TestingExample);
