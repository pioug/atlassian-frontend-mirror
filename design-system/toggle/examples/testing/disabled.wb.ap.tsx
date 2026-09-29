import { wb, type WorkbenchExample } from '@atlassian/workbench';

import DisabledExample from '../2-disabled.vr.ap';

export const Disabled: WorkbenchExample<typeof DisabledExample> = wb(DisabledExample);
