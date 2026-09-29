import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../26-annotations-simplified';

export const AnnotationsSimplified: WorkbenchExample<typeof Example> = wb(Example);
