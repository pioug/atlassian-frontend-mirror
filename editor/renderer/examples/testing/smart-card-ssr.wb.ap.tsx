import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../102-smart-card-ssr';

export const SmartCardSsr: WorkbenchExample<typeof Example> = wb(Example);
