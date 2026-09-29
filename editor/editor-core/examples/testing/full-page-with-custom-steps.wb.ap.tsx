import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../5-full-page-with-custom-steps';

export const FullPageWithCustomSteps: WorkbenchExample<typeof Example> = wb(Example);
