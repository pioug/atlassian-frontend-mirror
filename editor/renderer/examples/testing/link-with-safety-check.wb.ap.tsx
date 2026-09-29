import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../103-link-with-safety-check';

export const LinkWithSafetyCheck: WorkbenchExample<typeof Example> = wb(Example);
