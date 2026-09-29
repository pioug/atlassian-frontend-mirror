import { wb, type WorkbenchExample } from '@atlassian/workbench';

import SingleStepExample from '../single-step';

export const SingleStep: WorkbenchExample<typeof SingleStepExample> = wb(SingleStepExample);
