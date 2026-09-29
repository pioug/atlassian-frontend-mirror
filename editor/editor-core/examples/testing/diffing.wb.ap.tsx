import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../23-diffing';

export const Diffing: WorkbenchExample<typeof Example> = wb(Example);
