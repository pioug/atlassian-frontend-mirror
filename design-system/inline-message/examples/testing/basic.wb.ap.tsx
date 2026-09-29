import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicExample from '../01-basic.vr.ap';

export const Basic: WorkbenchExample<typeof BasicExample> = wb(BasicExample);
