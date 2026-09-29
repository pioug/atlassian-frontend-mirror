import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../200-add-telepointer';

export const AddTelepointer: WorkbenchExample<typeof Example> = wb(Example);
