import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../21-annotations';

export const Annotations: WorkbenchExample<typeof Example> = wb(Example);
