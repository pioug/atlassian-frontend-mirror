import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../4-ssr-tables';

export const SsrTables: WorkbenchExample<typeof Example> = wb(Example);
