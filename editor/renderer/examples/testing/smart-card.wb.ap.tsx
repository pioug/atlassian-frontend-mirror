import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../13-smart-card';

export const SmartCard: WorkbenchExample<typeof Example> = wb(Example);
