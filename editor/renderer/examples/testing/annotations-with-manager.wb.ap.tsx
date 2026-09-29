import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../21-annotations-with-manager';

export const AnnotationsWithManager: WorkbenchExample<typeof Example> = wb(Example);
