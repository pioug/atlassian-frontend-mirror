import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../10-chromeless';

export const Chromeless: WorkbenchExample<typeof Example> = wb(Example);
