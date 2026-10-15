import { wb, type WorkbenchExample } from '@atlassian/workbench';

import MotionExample from '../12-motion';

export const Motion: WorkbenchExample<typeof MotionExample> = wb(MotionExample);
