import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../26-annotations-with-manager';

export const AnnotationsWithManager: WorkbenchExample<typeof Example> = wb(Example);
