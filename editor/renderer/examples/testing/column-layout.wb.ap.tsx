import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../10-column-layout';

export const ColumnLayout: WorkbenchExample<typeof Example> = wb(Example);
