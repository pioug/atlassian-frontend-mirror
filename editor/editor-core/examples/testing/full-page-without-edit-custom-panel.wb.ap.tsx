import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../5-full-page-without-edit-custom-panel';

export const FullPageWithoutEditCustomPanel: WorkbenchExample<typeof Example> = wb(Example);
