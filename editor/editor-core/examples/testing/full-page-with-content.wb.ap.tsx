import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../5-full-page-with-content';

export const FullPageWithContent: WorkbenchExample<typeof Example> = wb(Example);
