import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../3-collab';

export const Collab: WorkbenchExample<typeof Example> = wb(Example);
