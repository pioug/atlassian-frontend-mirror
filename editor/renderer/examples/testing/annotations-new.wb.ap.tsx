import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../21-annotations-new';

export const AnnotationsNew: WorkbenchExample<typeof Example> = wb(Example);
