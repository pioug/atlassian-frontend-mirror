import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../5-full-page-with-custom-panel';

export const FullPageWithCustomPanel: WorkbenchExample<typeof Example> = wb(Example);
