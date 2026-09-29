import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../99-libra-ncs-view-mode';

export const LibraNcsViewMode: WorkbenchExample<typeof Example> = wb(Example);
