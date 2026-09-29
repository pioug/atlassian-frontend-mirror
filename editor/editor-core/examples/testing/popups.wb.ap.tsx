import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../12-popups';

export const Popups: WorkbenchExample<typeof Example> = wb(Example);
