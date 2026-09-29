import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../99-libra';

export const Libra: WorkbenchExample<typeof Example> = wb(Example);
