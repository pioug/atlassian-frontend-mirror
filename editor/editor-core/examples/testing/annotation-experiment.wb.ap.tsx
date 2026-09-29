import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../26-annotation-experiment';

export const AnnotationExperiment: WorkbenchExample<typeof Example> = wb(Example);
