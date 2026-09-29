import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../25-full-page-lag-lab';

export const FullPageLagLab: WorkbenchExample<typeof Example> = wb(Example);
