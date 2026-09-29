import { wb, type WorkbenchExample } from '@atlassian/workbench';

import MaxSizeExample from '../03-max-size.vr.ap';

export const MaxSize: WorkbenchExample<typeof MaxSizeExample> = wb(MaxSizeExample);
