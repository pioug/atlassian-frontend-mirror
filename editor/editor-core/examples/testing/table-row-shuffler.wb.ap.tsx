import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../19-table-row-shuffler';

export const TableRowShuffler: WorkbenchExample<typeof Example> = wb(Example);
