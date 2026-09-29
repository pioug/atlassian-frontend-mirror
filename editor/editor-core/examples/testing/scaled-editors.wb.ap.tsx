import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../27-scaled-editors';

export const ScaledEditors: WorkbenchExample<typeof Example> = wb(Example);
