import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingExample from '../99-testing.vr.ap';

export const Testing: WorkbenchExample<typeof TestingExample> = wb(TestingExample);
