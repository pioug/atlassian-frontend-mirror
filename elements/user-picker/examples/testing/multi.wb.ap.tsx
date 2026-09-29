import { wb, type WorkbenchExample } from '@atlassian/workbench';

import MultiExample from '../01-multi.vr.ap';

export const Multi: WorkbenchExample<typeof MultiExample> = wb(MultiExample);
