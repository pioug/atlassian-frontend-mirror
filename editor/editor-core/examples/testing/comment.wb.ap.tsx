import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../2-comment';

export const Comment: WorkbenchExample<typeof Example> = wb(Example);
