import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../32-full-page-click-to-edit';

export const FullPageClickToEdit: WorkbenchExample<typeof Example> = wb(Example);
