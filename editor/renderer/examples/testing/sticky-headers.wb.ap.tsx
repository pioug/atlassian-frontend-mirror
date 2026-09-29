import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../12-sticky-headers';

export const StickyHeaders: WorkbenchExample<typeof Example> = wb(Example);
