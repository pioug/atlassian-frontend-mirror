import { wb, type WorkbenchExample } from '@atlassian/workbench';

import MultipleExample from '../40-multiple.vr.ap';

export const Multiple: WorkbenchExample<typeof MultipleExample> = wb(MultipleExample);
