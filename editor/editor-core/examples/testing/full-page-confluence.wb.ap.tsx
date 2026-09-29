import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../5-full-page-confluence';

export const FullPageConfluence: WorkbenchExample<typeof Example> = wb(Example);
