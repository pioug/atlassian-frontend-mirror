import { wb, type WorkbenchExample } from '@atlassian/workbench';

import OverflowExample from '../140-overflow.vr.ap';

export const Overflow: WorkbenchExample<typeof OverflowExample> = wb(OverflowExample);
