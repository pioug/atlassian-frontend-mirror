import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as BasicExample } from '../01-basic';

export const Basic: WorkbenchExample<typeof BasicExample> = wb(BasicExample);
