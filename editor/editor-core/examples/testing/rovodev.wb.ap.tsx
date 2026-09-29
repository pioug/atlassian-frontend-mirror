import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../99-rovodev';

export const Rovodev: WorkbenchExample<typeof Example> = wb(Example);
