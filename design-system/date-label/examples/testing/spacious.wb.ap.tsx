import { wb, type WorkbenchExample } from '@atlassian/workbench';

import SpaciousExample from '../3-spacious.vr.ap';

export const Spacious: WorkbenchExample<typeof SpaciousExample> = wb(SpaciousExample);
