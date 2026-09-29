import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../11-overflow';

export const Overflow: WorkbenchExample<typeof Example> = wb(Example);
