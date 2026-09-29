import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../1000-resizer-basic';

export const ResizerBasic: WorkbenchExample<typeof Example> = wb(Example);
