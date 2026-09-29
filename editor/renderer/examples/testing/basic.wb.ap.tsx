import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../0-basic';

export const Basic: WorkbenchExample<typeof Example> = wb(Example);
