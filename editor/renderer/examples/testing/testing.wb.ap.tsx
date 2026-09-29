import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../99-testing';

export const Testing: WorkbenchExample<typeof Example> = wb(Example);
