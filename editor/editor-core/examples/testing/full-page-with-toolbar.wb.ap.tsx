import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../5-full-page-with-toolbar';

export const FullPageWithToolbar: WorkbenchExample<typeof Example> = wb(Example);
