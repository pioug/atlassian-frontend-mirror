import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../18-table-perf-test';

export const TablePerfTest: WorkbenchExample<typeof Example> = wb(Example);
