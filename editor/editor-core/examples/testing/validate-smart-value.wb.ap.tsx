import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../16-validate-smart-value';

export const ValidateSmartValue: WorkbenchExample<typeof Example> = wb(Example);
