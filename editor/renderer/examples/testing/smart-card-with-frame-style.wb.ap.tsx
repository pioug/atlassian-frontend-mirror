import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../13-smart-card-with-frameStyle';

export const SmartCardWithFrameStyle: WorkbenchExample<typeof Example> = wb(Example);
