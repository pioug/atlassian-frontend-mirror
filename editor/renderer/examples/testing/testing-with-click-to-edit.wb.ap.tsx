import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../100-testing-with-click-to-edit';

export const TestingWithClickToEdit: WorkbenchExample<typeof Example> = wb(Example);
