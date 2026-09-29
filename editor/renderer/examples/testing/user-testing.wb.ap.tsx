import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../17-user-testing';

export const UserTesting: WorkbenchExample<typeof Example> = wb(Example);
