import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../0-full-page-with-custom-panel';

export const FullPageWithCustomPanel: WorkbenchExample<typeof Example> = wb(Example);
