import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicExample from '../basic.vr.ap';

export const Basic: WorkbenchExample<typeof BasicExample> = wb(BasicExample);
