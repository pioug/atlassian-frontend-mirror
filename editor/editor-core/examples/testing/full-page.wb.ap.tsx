import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../5-full-page';

export const FullPage: WorkbenchExample<typeof Example> = wb(Example);
