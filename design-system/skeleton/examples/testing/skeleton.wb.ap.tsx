import { wb, type WorkbenchExample } from '@atlassian/workbench';

import AllExample from '../all.vr.ap';

export const All: WorkbenchExample<typeof AllExample> = wb(AllExample);
