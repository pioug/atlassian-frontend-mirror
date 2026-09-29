import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../5-full-page-confluence-limited-mode';

export const FullPageConfluenceLimitedMode: WorkbenchExample<typeof Example> = wb(Example);
