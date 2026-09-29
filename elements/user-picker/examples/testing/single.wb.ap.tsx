import { wb, type WorkbenchExample } from '@atlassian/workbench';

import SingleExample from '../00-single';

export const Single: WorkbenchExample<typeof SingleExample> = wb(SingleExample);
