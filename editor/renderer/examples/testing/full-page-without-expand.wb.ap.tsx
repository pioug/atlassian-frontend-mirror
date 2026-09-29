import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../19-full-page-without-expand';

export const FullPageWithoutExpand: WorkbenchExample<typeof Example> = wb(Example);
