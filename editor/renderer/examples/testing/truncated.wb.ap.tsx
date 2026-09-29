import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../15-truncated';

export const Truncated: WorkbenchExample<typeof Example> = wb(Example);
