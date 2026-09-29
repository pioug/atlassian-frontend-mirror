import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicExample from '../0-basic.vr.ap';

export const Basic: WorkbenchExample<typeof BasicExample> = wb(BasicExample);
