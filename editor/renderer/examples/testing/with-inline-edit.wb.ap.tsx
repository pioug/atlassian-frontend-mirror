import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../104-with-inline-edit';

export const WithInlineEdit: WorkbenchExample<typeof Example> = wb(Example);
