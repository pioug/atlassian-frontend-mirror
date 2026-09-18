import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as BasicExampleSource } from './Basic.example';

export const BasicExample: WorkbenchExample = wb(BasicExampleSource);
