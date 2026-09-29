import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../2-confluence-basic';

export const ConfluenceBasic: WorkbenchExample<typeof Example> = wb(Example);
