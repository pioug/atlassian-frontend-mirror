import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../21-annotations-new-playwright';

export const AnnotationsNewPlaywright: WorkbenchExample<typeof Example> = wb(Example);
